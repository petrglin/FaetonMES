import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const html = readFileSync(new URL("../vendor/factory-demo/factory-demo.html", import.meta.url), "utf8");
const scene = html.match(/data-srcdoc="([\s\S]*?)"/)[1]
  .replaceAll("&quot;", '"').replaceAll("&#x27;", "'")
  .replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");

test("perspective keeps its angle, centers the projection and fills the available area without clipping", () => {
  const functionSource = scene.slice(scene.indexOf("function fittedView("), scene.indexOf("function refitOverview("));
  // Uneven equipment footprint: tall machines, long conveyors and a lower loading area.
  const points = [[-2700, 0, 700], [-2200, 160, -1200], [-1800, 240, -500],
    [-500, 80, 400], [400, 350, -100], [700, 120, 100], [-1200, 0, 1400]]
    .map(([x, y, z]) => ({ x, y, z }));
  for (const [w, h] of [[1280, 396], [1920, 900], [800, 600], [390, 600]]) {
    const fit = vm.runInNewContext(`${functionSource};fittedView('perspective', points)`, { w, h, points });
    assert.equal(fit.azimuth, -Math.PI / 4);
    assert.equal(fit.elevation, Math.atan(1 / Math.sqrt(2)));
    const a = fit.azimuth, e = fit.elevation;
    const right = [Math.cos(a), 0, -Math.sin(a)];
    const up = [-Math.sin(a) * Math.sin(e), Math.cos(e), -Math.cos(a) * Math.sin(e)];
    const normal = [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)];
    const dot = (p, v) => p.reduce((sum, n, i) => sum + n * v[i], 0);
    const tanV = Math.tan(38 * Math.PI / 360), tanH = tanV * w / h;
    const projected = points.map(p => {
      const d = [p.x - fit.target.x, p.y - fit.target.y, p.z - fit.target.z];
      const depth = fit.distance - dot(d, normal);
      assert.ok(depth > 0);
      return [dot(d, right) / depth / tanH, dot(d, up) / depth / tanV];
    });
    const bounds = [0, 1].map(axis => [Math.min(...projected.map(p => p[axis])), Math.max(...projected.map(p => p[axis]))]);
    for (const [min, max] of bounds) {
      assert.ok(min >= -.961 && max <= .961, "Every point stays inside the frame margin");
      assert.ok(Math.abs(min + max) < .01, "The projected footprint is centered");
    }
    assert.ok(Math.max(...bounds.map(([min, max]) => (max - min) / 2)) > .95);
  }
});

test("equal-size drilled parts reuse geometry instead of rebuilding every hidden part", () => {
  let builds = 0;
  class Shape {
    holes = [];
    moveTo() {} lineTo() {} closePath() {} absarc() {}
  }
  class Geometry {
    constructor() { builds++; }
    rotateX() {} translate() {} computeVertexNormals() {}
    getAttribute() { return { count: 0, setXY() {} }; }
  }
  const helper = scene.slice(scene.indexOf("const drilledGeometryCache="), scene.indexOf("function board(p)"));
  const { create, shared } = vm.runInNewContext(`${helper};({create:drilledGeometry,shared:sharedDrilledGeometries})`, {
    T: { Shape, Path: Shape, ExtrudeGeometry: Geometry }, drillRadius: 1.25,
  });
  const first = create(50, 28);
  for (let i = 0; i < 128; i++) assert.equal(create(50, 28), first);
  assert.equal(builds, 1);
  assert.ok(shared.has(first));
  assert.notEqual(create(72, 42), first);
  assert.equal(builds, 2);
});

test("the factory shows the test-mode caption in Russian and English", () => {
  assert.ok(scene.includes("Виртуальная фабрика работает в тестовом режиме"));
  assert.ok(scene.includes("The virtual factory is running in test mode"));
});

test("rotation preserves the current camera pose after perspective, restart and manual changes", () => {
  const controls = new Map();
  const root = { querySelector(id) {
    if (!controls.has(id)) controls.set(id, { value: "", textContent: "", setAttribute() {} });
    return controls.get(id);
  } };
  const rotationSource = scene.slice(scene.indexOf("function createSceneRotation("), scene.indexOf("function sceneOrbitCenter("));
  const setup = scene.match(/const sceneRotation=createSceneRotation[^\n]+/)[0];
  const harness = `
    let azimuth=-Math.PI/4,elevation=Math.atan(1/Math.sqrt(2)),distance=2844;
    let cameraTarget={x:-1000,y:100,z:300},cameraFlight=null,zoomTarget=null,topView=false,perspectiveView=true;
    // Removing the tracking panel can trigger a resize/refit while an overview is active.
    function stopFollow(){if(topView||perspectiveView){distance=9999;cameraTarget={x:0,y:0,z:0};}}
    function sceneOrbitCenter(){return {x:40,y:0,z:80};}
    function sync(){}
    ${rotationSource}
    ${setup}
    ({rotation:sceneRotation,
      pose:()=>({azimuth,elevation,distance,cameraTarget:{...cameraTarget}}),
      change:()=>{azimuth=1.2;elevation=.9;distance=1850;cameraTarget={x:20,y:40,z:-60};},
      flight:()=>{perspectiveView=true;cameraFlight={elapsed:.5};}});
  `;
  const api = vm.runInNewContext(harness, { root });
  const button = controls.get("#fl-rotate");
  const pose = () => JSON.parse(JSON.stringify(api.pose()));
  let previous = pose();
  button.onclick();
  assert.deepEqual(pose(), previous, "Starting after perspective must not move the camera");
  api.rotation.advance(0);
  assert.deepEqual(pose(), previous);
  api.rotation.advance(10);
  assert.notEqual(pose().azimuth, previous.azimuth);
  previous = pose();
  button.onclick();
  assert.deepEqual(pose(), previous, "Stopping keeps the last angle");
  button.onclick();
  assert.deepEqual(pose(), previous, "Restarting continues from that angle");
  button.onclick();
  api.change();
  previous = pose();
  api.flight();
  button.onclick();
  assert.deepEqual(pose(), previous, "Manual or in-flight camera changes must not be reset");
});
