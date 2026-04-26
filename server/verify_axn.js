const mongoose = require('mongoose');

// The one that worked before
require('dotenv').config();
const AXN_URI = process.env.MONGO_URI;
console.log("Testing AXN Cluster...");

mongoose.connect(AXN_URI)
.then(() => {
    console.log("SUCCESS: AXN Connected ✅");
    process.exit(0);
})
.catch((err) => {
    console.error("FAILURE: AXN Connection error ❌", err.message);
    process.exit(1);
});
