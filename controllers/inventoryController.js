const pool = require('../config/db');

exports.getAllStatus = async (req, res) => {
    try {
        const inventoryResult = await pool.query('SELECT * FROM inventory ORDER BY id ASC');
        const cartResult = await pool.query(
            'SELECT c.id, c.item_id, i.name, c.quantity FROM cart c JOIN inventory i ON c.item_id = i.id ORDER BY c.id ASC'
        );
        res.json({ inventory: inventoryResult.rows, cart: cartResult.rows });
    } catch (err) {
        res.status(500).json({ error: 'Database read anomaly: ' + err.message });
    }
};

exports.updateStock = async (req, res) => {
    const id = parseInt(req.params.id);
    const { action, amount } = req.body;
    const change = action === 'add' ? amount : -amount;

    try {
        const result = await pool.query(
            'UPDATE inventory SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
            [change, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Item non-existent.' });
        res.json({ success: true, item: result.rows[0] });
    } catch (err) {
        // Postgres CHECK constraint violation triggers a code '23514' (negative stock protection)
        if (err.code === '23514') {
            return res.status(400).json({ error: 'Operation rejected: Insufficient stock baseline.' });
        }
        res.status(500).json({ error: err.message });
    }
};
