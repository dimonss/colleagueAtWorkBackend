const app = require('./server');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation:`);
  console.log(`GET    /api/colleagues     - Get all colleagues`);
  console.log(`GET    /api/colleagues/:id - Get single colleague`);
  console.log(`POST   /api/colleagues     - Add new colleague (Basic Auth required)`);
  console.log(`PUT    /api/colleagues/:id - Update colleague (Basic Auth required)`);
  console.log(`DELETE /api/colleagues/:id - Delete colleague (Basic Auth required)`);
  console.log(`\nDefault admin credentials: admin / admin123`);
  console.log(`Static files served from: /static`);
}); 