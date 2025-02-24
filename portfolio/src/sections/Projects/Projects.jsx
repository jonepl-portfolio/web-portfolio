import styles from './ProjectsStyles.module.css';
import portfolio from '../../assets/web-portfolio-v2.png';
import csvMerger from '../../assets/csv-merger-api.png'
import flaskScaffolder from '../../assets/flask-api-scaffolder.png';
import investo from '../../assets/Investo-Manifesto-v2.png';
import ProjectCard from '../../common/ProjectCard';

function Projects() {
  return (
    <section id="projects" className={styles.container}>
      <h1 className="sectionTitle">Projects</h1>
      <div className={styles.projectsContainer}>
        <ProjectCard
          src={portfolio}
          link="https://github.com/jonepl-portfolio"
          h3="Portfolio"
          p="Web Portfolio"
        />
        <ProjectCard
          src={investo}
          link="https://github.com/jonepl/Investo-Manifesto"
          h3="Investo Manifesto"
          p="Finacial Investment Visualizer"
        />
        <ProjectCard
          src={csvMerger}
          link="https://github.com/jonepl-portfolio/csv-merger-api"
          h3="CSV Merger API"
          p="Merge CSV files"
        />
        <ProjectCard
          src={flaskScaffolder}
          link="https://github.com/jonepl/api-scaffolder"
          h3="API Scaffolder"
          p="Generate APIs using Flask"
        />
      </div>
    </section>
  );
}

export default Projects;
