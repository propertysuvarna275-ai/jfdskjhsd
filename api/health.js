const { Pool } = require("@neondatabase/serverless");

module.exports = async (req, res) => {
  try {
    // Cek environment variables
    const rawUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "";
    const normalizedUrl = String(rawUrl || "").trim().replace(/^['"](.+)['"]$/, "$1");
    const envStatus = {
      NEON_DATABASE_URL: !!normalizedUrl,
      JWT_SECRET: !!process.env.JWT_SECRET,
      DEFAULT_ADMIN_PASSWORD: !!process.env.DEFAULT_ADMIN_PASSWORD,
      usingDATABASE_URL: !!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL
    };

    if (!normalizedUrl) {
      throw new Error("Variabel lingkungan NEON_DATABASE_URL/DATABASE_URL tidak diatur atau kosong.");
    }
    if (!normalizedUrl.toLowerCase().startsWith("postgres://") && !normalizedUrl.toLowerCase().startsWith("postgresql://")) {
      throw new Error("NEON_DATABASE_URL/DATABASE_URL harus menggunakan prefix postgres:// atau postgresql://");
    }

    // Coba koneksi database
    const pool = new Pool({ connectionString: normalizedUrl });
    const result = await pool.query("SELECT NOW() AS current_time");
    
    return res.status(200).json({
      status: "OK",
      environment: envStatus,
      database: {
        connected: true,
        time: result.rows[0].current_time
      },
      timestamp: new Date().toISOString()
    });
      status: "OK",
      environment: envStatus,
      database: {
        connected: true,
        time: result.rows[0].current_time
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[HEALTH] Error:", error.message);
    return res.status(500).json({
      status: "ERROR",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
