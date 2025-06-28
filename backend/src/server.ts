import "dotenv/config";
import server from "./app";
import "express-async-errors";
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});