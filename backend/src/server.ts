import "dotenv/config";
import app from "./app";
import "express-async-errors";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});