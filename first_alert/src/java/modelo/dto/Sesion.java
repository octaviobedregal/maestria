package modelo.dto;

import modelo.pojo.Usuario;

/**
 * Es una clase de tipo entidad con sus get y set por cada atributo
 *
 * @author
 * @version 10/11/2018/A
 */
public class Sesion {

    private Usuario usuario;

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

}
