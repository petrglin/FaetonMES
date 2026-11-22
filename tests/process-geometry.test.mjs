import test from 'node:test';
import assert from 'node:assert/strict';
import {edgePort, connectionPath, incomingPortOffsets} from '../src/lib/process-geometry.ts';
const pose = {x: 440, y: 130, width: 200, height: 164, a: 1, b: 0, c: 0, d: 1};
test('connection endpoints touch the actual card edges', () => {
  assert.deepEqual(edgePort(pose, 'left'), {x:340,y:130,nx:-1,ny:0});
  assert.equal(connectionPath({...pose, x:140,y:245}, pose), 'M240 245 C290 245 290 130 340 130');
});
test('ports follow translation, rotation and scale', () => {
  const transformed = {...pose, x:444, y:127, a:0, b:2, c:-2, d:0};
  assert.deepEqual(edgePort(transformed, 'left'), {x:444,y:-73,nx:-0,ny:-1});
  assert.deepEqual(edgePort(transformed, 'bottom'), {x:280,y:127,nx:-1,ny:0});
});
test('upward connection reaches the configurator bottom edge', () => {
  assert.equal(connectionPath({...pose,y:360}, pose,{vertical:true}), 'M440 278 C440 245 440 245 440 212');
});
test('downward purchasing connection ends at the production top edge', () => {
  assert.equal(connectionPath(pose, {...pose,y:360}, {vertical:true}), 'M440 212 C440 245 440 245 440 278');
});
test('warehouse-to-production route goes around the purchasing column', () => {
  const path = connectionPath({...pose,x:1040}, {...pose,x:1040,y:590}, {detour:"right"});
  const coordinates=path.match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.deepEqual(coordinates.slice(0,2),[1140,130]);
  assert.deepEqual(coordinates.slice(-2),[1140,590]);
  assert.equal(coordinates[6],1204);
  assert.ok(coordinates[7]-130 >= (1204-1140)*.75, 'bend must use the available corridor smoothly');
});

test('planning return connection takes a separate lane on the left', () => {
  const path = connectionPath({...pose,x:1040,y:590}, {...pose,x:1040}, {detour:'left'});
  const coordinates=path.match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.deepEqual(coordinates.slice(0,2),[940,590]);
  assert.deepEqual(coordinates.slice(-2),[940,130]);
  assert.equal(coordinates[6],876);
  assert.ok(590-coordinates[7] >= (940-876)*.75);
});
test('planning connections enter the bottom of downstream blocks', () => {
  const path = connectionPath({...pose,x:728,y:574,width:140,height:114.8}, {...pose,x:938,y:413,width:140,height:114.8}, {toBottom:true});
  assert.equal(path, 'M798 574 C868 574 938 540.4 938 470.4');
});
test('monitoring enters production through the gap between columns', () => {
  const path = connectionPath({...pose,x:938,y:574,width:140,height:114.8}, {...pose,x:728,y:413,width:140,height:114.8}, {fromSide:'left',toSide:'right'});
  assert.equal(path, 'M868 574 C833 574 833 413 798 413');
});

test('three incoming arrows get separate ports along the top edge', () => {
  const poses = new Map([
    ['left', {...pose,x:150,y:175,width:40,height:20}],
    ['middle', {...pose,x:198,y:175,width:40,height:20}],
    ['right', {...pose,x:240,y:175,width:40,height:20}],
    ['orders', {...pose,x:198,y:332.5,width:140,height:114.8}],
  ]);
  const links = ['right','left','middle'].map(from=>({from,to:'orders',vertical:true}));
  const offsets = incomingPortOffsets(poses,links);
  const ports = offsets.map(offset=>edgePort(poses.get('orders'),'top',offset));
  assert.equal(new Set(ports.map(port=>port.x)).size,3);
  assert.ok(ports.every(port=>port.y===275.1));
  assert.ok(ports[1].x<ports[2].x && ports[2].x<ports[0].x);
  assert.ok(Math.min(ports[2].x-ports[1].x,ports[0].x-ports[2].x)>8);
});
test('separated ports follow rotated edges and stay away from rounded corners', () => {
  const transformed = {...pose, a:0,b:1,c:-1,d:0};
  const port = edgePort(transformed,'top',.5);
  assert.equal(port.x,522);
  assert.equal(port.y,180);
  assert.deepEqual(edgePort(pose,'left',10),edgePort(pose,'left',.65));
});

test('planning corridor uses broad bends without moving either endpoint', () => {
  const path=connectionPath({...pose,x:728,y:574,width:140,height:114.8}, {...pose,x:938,y:413,width:140,height:114.8}, {bottomLane:.12});
  const coordinates=path.match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.deepEqual(coordinates.slice(0,2),[798,574]);
  assert.deepEqual(coordinates.slice(-2),[938,470.4]);
  assert.ok(574-coordinates[7] > 33, 'vertical bend must be broad enough to avoid a tight elbow');
  assert.ok(coordinates.filter((_,index)=>index%2===0).every(x=>x>=798&&x<=938));
});
