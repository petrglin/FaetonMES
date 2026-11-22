import Image from "next/image";
import { teamMembers } from "@/lib/team";

export function AboutTeam() {
  return (
    <section className="about-team" aria-labelledby="team-heading" id="team">
      <header className="about-team-header">
        <h2 id="team-heading">Команда внедрения</h2>
        <p>Здесь мы представим основных участников команды внедрения программных продуктов.</p>
        <p className="about-team-note">Пока используются вымышленные портреты и примеры ролей.</p>
      </header>
      <ul className="about-team-grid">
        {teamMembers.map((member) => (
          <li key={member.id}>
            <article className="about-team-card">
              <div className="about-team-photo">
                <Image src={member.image} alt={`Демонстрационный портрет: ${member.role.toLowerCase()}`} width={640} height={640} sizes="(max-width: 599px) 100vw, (max-width: 899px) 50vw, 33vw" />
              </div>
              <div className="about-team-info">
                <p className="about-team-role">{member.role}</p>
                <h3>{member.name}</h3>
                <p className="about-team-description">{member.description}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
