import mongoose from "mongoose";

const connectionDB = async () => {
    await mongoose.connect(process.env.URI_CONNECTION).then(() => {
        console.log(`connected to DB on url ${process.env.URI_CONNECTION}`);
    }).catch((error) => {
        console.log("Error connecting to DB", error);
    });
};

export default connectionDB