const path = require('node:path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../bot.db');
const db = new Database(dbPath);

// Offences db exec & Vars
db.exec(`
    CREATE TABLE IF NOT EXISTS mod_cases(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        moderator_id TEXT,
        action TEXT NOT NULL,
        created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_mod_cases_guild_user
        ON mod_cases (guild_id, user_id);
`);

const addOffenceStatement = db.prepare(`
        INSERT INTO mod_cases (guild_id, user_id, moderator_id, action, created_at)
        VALUES (@guild_id, @user_id, @moderator_id, @action, @created_at)
    `);

const getOffencesST = db.prepare(`
        SELECT id, moderator_id, action, created_at
        FROM mod_cases
        WHERE guild_id = ? AND user_id = ?
        ORDER BY created_at DESC
    `);

const getOffenceCountST = db.prepare(`
        SELECT COUNT(*) AS total
        FROM mod_cases
        WHERE guild_id = ? AND user_id = ? 
    `);

//  -------------- Offence DB functions -------------- //
function addOffence(guild_id, user_id, moderator_id = null, action, reason = null) {
    const info = addOffenceStatement.run({
        guild_id,
        user_id,
        moderator_id,
        action,
        reason,
        createdAt: Date.now(),
    });

    return info.lastInsertRowid;
}

function getOffences(guild_id, user_id) {
    return getOffencesST.all(guild_id, user_id);
}

function getOffenceCount(guild_id, user_id) {
    return getOffenceCountST.get(guild_id, user_id).total;
}

// Export
module.exports = {
    addOffence,
    getOffences,
    getOffenceCount
}