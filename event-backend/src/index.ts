import { createServer } from './server.js';
import { PORT } from './util/config.js';

createServer().then(({ httpServer }) => {
  httpServer.listen(PORT, () => {
    console.log(`Server is now running at http://localhost:${PORT}/graphql`);
  });
}).catch((err) => {
  console.error('Failed to start the app:', err);
  process.exit(1);
});