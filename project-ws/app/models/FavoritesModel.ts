import { DatabaseMethods } from '../../config/database/DatabaseMethods';

class FavoritesModel {
    // Agregar a favoritos
    static async add(iduser: string, idproduct: string) {
        const query = "INSERT INTO favorites (users_idusers, products_idproducts) VALUES (?, ?)";
        return await DatabaseMethods.save({ query, params: [iduser, idproduct] });
    }

    // Quitar de favoritos
    static async remove(iduser: string, idproduct: string) {
        const query = "DELETE FROM favorites WHERE users_idusers = ? AND products_idproducts = ?";
        return await DatabaseMethods.save({ query, params: [iduser, idproduct] });
    }

    // Ver favoritos de un usuario (trayendo datos del producto)
    static async getByUser(iduser: string) {
        const query = `
            SELECT p.* FROM products p
            INNER JOIN favorites f ON p.idproducts = f.products_idproducts
            WHERE f.users_idusers = ? AND p.active = 1
        `;
        return await DatabaseMethods.query({ query, params: [iduser] });
    }
}

export { FavoritesModel };