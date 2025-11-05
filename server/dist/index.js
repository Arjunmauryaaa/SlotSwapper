import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import app from './app.js';
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const server = createServer(app);
server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
});
export default server;
