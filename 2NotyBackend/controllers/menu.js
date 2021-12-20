const { response } = require("express");
const { param } = require("express-validator");

const { pool } = require("./../dbCongif");

const getMenu = async (req, res = response) => {
    const idMenu = req.params.id;
    const aux = (idMenu === 'undefined' || idMenu === '{id}') ? '' : `WHERE id_menu=${idMenu}`;
    pool.connect().then((client) => {
        return client
            .query(`SELECT * FROM menus  ${aux} ORDER BY id_menu`)
            .then((response) => {
                client.release();
                res.status(200).json({
                    ok: true,
                    data: response.rows,
                });
            })
            .catch((err) => {
                client.release();
                res.status(400).json({
                    ok: false,
                    msg: err,
                });
            });
    });
};

const postMenu = async (req, res = response) => {
    const { menu, icon, defaul } = req.body;
    const menuLowerCase = menu.toLowerCase();
    pool.connect().then((client) => {
        return client
            .query(`SELECT * FROM menus WHERE lower(menu)=$1`, [
                menuLowerCase,
            ])
            .then((response) => {
                if (response.rows.length > 0) {
                    res.status(200).json({
                        ok: true,
                        msg: "Ya se encuentra registrado el menú",
                    });
                } else {
                    return client
                        .query(
                            `INSERT INTO menus(menu,icon,"default")
                VALUES($1,$2,$3)`,
                            [menuLowerCase, icon, defaul]
                        )
                        .then((response) => {
                            client.release();
                            res.status(201).json({
                                ok: true,
                                msg: response.command,
                            });
                        })
                        .catch((err) => {
                            client.release();
                            res.status(400).json({
                                ok: false,
                                msg: err,
                            });
                        });
                }
            })
            .catch((err) => {
                client.release();
                res.status(400).json({
                    ok: false,
                    msg: err,
                });
            });
    });
};

const updateMenu = async (req, res = response) => {
    const { id_menu, menu, icon, defaul } = req.body;
    const menuLower = menu.toLowerCase();
    pool.connect().then((client) => {
        return client
            .query(
                `UPDATE menus SET menu=$2, icon=$3, "default"=$4 where id_menu=$1`,
                [id_menu, menuLower, icon, defaul]
            )
            .then((response) => {
                client.release();
                res.status(201).json({
                    ok: true,
                    data: response.command,
                });
            })
            .catch((err) => {
                client.release();
                res.status(400).json({
                    ok: false,
                    msg: err,
                });
            });
    });
};

const getSubMenu = async (req, res = response) => {
    const idSubMenu = req.params.id;
    const aux = (idSubMenu === 'undefined' || idSubMenu === '{id}') ? '' : `AND sb.id_submenu=${idSubMenu}`;
    pool.connect().then((client) => {
        return client
            .query(`SELECT sb.*,m.menu FROM submenus sb, menus m 
            WHERE sb.id_menu=m.id_menu  ${aux} ORDER BY m.id_menu,sb.id_submenu`)
            .then((response) => {
                client.release();
                res.status(200).json({
                    ok: true,
                    data: response.rows,
                });
            })
            .catch((err) => {
                client.release();
                res.status(400).json({
                    ok: false,
                    msg: err,
                });
            });
    });
};

const postSubMenu = async (req, res = response) => {
    const { id_menu, submenu, icon, defaul } = req.body;
    const submenuLowerCase = submenu.toLowerCase();
    pool.connect().then((client) => {
        return client
            .query(`SELECT * FROM submenus WHERE lower(submenu)=$1 AND id_menu=$2`, [
                submenuLowerCase,id_menu
            ])
            .then((response) => {
                if (response.rows.length > 0) {
                    res.status(200).json({
                        ok: true,
                        msg: "Ya se encuentra registrado el submenu",
                    });
                } else {
                    return client
                        .query(
                            `INSERT INTO submenus(id_menu,submenu,icon,"default")
                VALUES($1,$2,$3,$4)`,
                            [id_menu, submenuLowerCase,icon, defaul]
                        )
                        .then((response) => {
                            client.release();
                            res.status(201).json({
                                ok: true,
                                msg: response.command,
                            });
                        })
                        .catch((err) => {
                            client.release();
                            res.status(400).json({
                                ok: false,
                                msg: err,
                            });
                        });
                }
            })
            .catch((err) => {
                client.release();
                res.status(400).json({
                    ok: false,
                    msg: err,
                });
            });
    });
};

const updateSubMenu = async (req, res = response) => {
    const { id_submenu, id_menu, submenu, icon, defaul } = req.body;
    const submenuLower = submenu.toLowerCase();
    pool.connect().then((client) => {
        return client
            .query(
                `UPDATE submenus SET id_menu=$2, submenu=$3, icon=$4, "default"=$5 where id_submenu=$1`,
                [id_submenu, id_menu, submenuLower, icon, defaul]
            )
            .then((response) => {
                client.release();
                res.status(201).json({
                    ok: true,
                    data: response.command,
                });
            })
            .catch((err) => {
                client.release();
                res.status(400).json({
                    ok: false,
                    msg: err,
                });
            });
    });
};

const getRelationMenuSubmenuProfile = async (req, res = response) => {
    const idPerfil=req.params.id;
    const aux = (idPerfil === 'undefined' || idPerfil === '{id}') ? '0' : `${idPerfil}`;
    pool.connect().then((client) => {
        return client
            .query(`SELECT *,COALESCE((SELECT activo FROM permisos_perfil WHERE id_perfil=${aux} AND id_menu=m.id_menu AND id_submenu is null),false) as activo
            ,( SELECT array_to_json(array_agg(t.*)) FROM (SELECT *,COALESCE((SELECT activo FROM permisos_perfil WHERE id_perfil=${aux} AND id_menu=m.id_menu AND id_submenu=s.id_submenu),false) as activo FROM submenus s WHERE s.id_menu=m.id_menu ORDER BY s.id_submenu) as t) as submenu
            FROM menus m ORDER BY m.id_menu`)
            .then((response) => {
                client.release();
                res.status(200).json({
                    ok: true,
                    data: response.rows,
                });
            })
            .catch((err) => {
                client.release();
                res.status(400).json({
                    ok: false,
                    msg: err,
                });
            });
    });
};

module.exports = {
    getMenu,
    postMenu,
    updateMenu,
    getSubMenu,
    postSubMenu,
    updateSubMenu,
    getRelationMenuSubmenuProfile
}