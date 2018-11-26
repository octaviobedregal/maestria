/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao;

import modelo.dto.Sesion;

/**
 *
 * @author
 */
public interface ISesionDao {

    public Sesion cargarSesion(long idUsuario);

    public long validarUsuario(String nombre, String clave);

}
