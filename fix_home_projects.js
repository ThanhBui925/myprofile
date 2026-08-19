const fs = require('fs');
const file = 'frontend/src/app/(public)/page.jsx';

if (fs.existsSync(file)) {
  let c = fs.readFileSync(file, 'utf8');
  let normalized = c.replace(/\r\n/g, '\n');
  
  // 1. Find the useQuery block for projects
  const oldQueryBlock = `  const { data: featuredProjects = [] } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => getProjects({ featured: 'true', limit: 3 })
  });
  const { data: allProjects = [] } = useQuery({ queryKey: ['projects', 'all'], queryFn: () => getProjects() });`;
  
  const newQueryBlock = `  const { data: featuredProjects = [], isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => getProjects({ featured: 'true', limit: 3 })
  });
  const { data: allProjects = [], isLoading: isLoadingAll } = useQuery({ 
    queryKey: ['projects', 'all'], 
    queryFn: () => getProjects() 
  });
  
  const displayedProjects = featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 3);
  const showSkeleton = isLoadingFeatured || (featuredProjects.length === 0 && isLoadingAll);`;
  
  if (normalized.includes(oldQueryBlock)) {
    normalized = normalized.replace(oldQueryBlock, newQueryBlock);
    console.log('Replaced query block');
  } else {
    console.log('Old query block not found');
  }
  
  // 2. Find the projects grid rendering block
  const oldRenderBlock = `          <div className="grid-3">
            {featuredProjects.length === 0 && [1,2,3].map(i => (
              <div key={i} className="card" style={{ aspectRatio: '4/3' }}>
                <div className="skeleton" style={{ height: '100%' }} />
              </div>
            ))}
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Link href={\`/projects/\${project.slug}\`} style={{ display: 'block' }}>
                  <div className="card img-overlay" style={{ aspectRatio: '4/3', position: 'relative' }}>
                    {project.images?.[0] ? (
                      <img src={\`/uploads/images/\${project.images[0]}\`} alt={project.titleVi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1A1A1A, #2A1500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Settings size={48} color="var(--color-primary)" opacity={0.3} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 2 }}>
                      {project.client && (
                        <span className="tag tag-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{project.client}</span>
                      )}
                      <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
                        {lang === 'vi' ? project.titleVi : project.titleEn}
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {(project.technologies || []).slice(0, 3).map(tech => (
                          <span key={tech} className="tag" style={{ fontSize: '0.72rem' }}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>`;
          
  const newRenderBlock = `          <div className="grid-3">
            {showSkeleton && [1,2,3].map(i => (
              <div key={i} className="card" style={{ aspectRatio: '4/3' }}>
                <div className="skeleton" style={{ height: '100%' }} />
              </div>
            ))}
            {!showSkeleton && displayedProjects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Link href={\`/projects/\${project.slug}\`} style={{ display: 'block' }}>
                  <div className="card img-overlay" style={{ aspectRatio: '4/3', position: 'relative' }}>
                    {project.images?.[0] ? (
                      <img src={\`/uploads/images/\${project.images[0]}\`} alt={project.titleVi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1A1A1A, #2A1500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Settings size={48} color="var(--color-primary)" opacity={0.3} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 2 }}>
                      {project.client && (
                        <span className="tag tag-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{project.client}</span>
                      )}
                      <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
                        {lang === 'vi' ? project.titleVi : project.titleEn}
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {(project.technologies || []).slice(0, 3).map(tech => (
                          <span key={tech} className="tag" style={{ fontSize: '0.72rem' }}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {!showSkeleton && displayedProjects.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem 0' }}>
                {lang === 'vi' ? 'Chưa có dự án nào' : 'No projects found'}
              </p>
            )}
          </div>`;
          
  if (normalized.includes(oldRenderBlock)) {
    normalized = normalized.replace(oldRenderBlock, newRenderBlock);
    console.log('Replaced render block');
  } else {
    console.log('Old render block not found');
  }
  
  if (c.includes('\r\n')) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(file, normalized, 'utf8');
  console.log('Done modifying page.jsx');
}
