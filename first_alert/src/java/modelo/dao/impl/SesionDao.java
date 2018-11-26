/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao.impl;

import java.io.FileOutputStream;
import java.math.BigInteger;
import java.util.Date;
import java.util.List;
import modelo.dao.HibernateUtil;
import modelo.dao.IMapaDao;
import modelo.dao.ISesionDao;
import modelo.dto.Sesion;
import modelo.pojo.Camino;
import modelo.pojo.Mapa;
import modelo.pojo.Nodo;
import modelo.pojo.Rol;
import modelo.pojo.Usuario;
import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import sun.misc.BASE64Decoder;

/**
 *
 * @author octavio
 */
public class SesionDao implements ISesionDao {

    /**
     * @param idUsuario Es el identificador de un usuario
     * @return La carga de información de la sesión
     */
    @Override
    public Sesion cargarSesion(long idUsuario) {
        Sesion sesionUsuario = new Sesion();
        Session sesion = null;
        try {
            sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            Query queryUsuario = sesion.createQuery("FROM Usuario WHERE id=:id ORDER BY id").setLong("id", idUsuario);
            Usuario usuario = (Usuario) queryUsuario.uniqueResult();
            sesionUsuario.setUsuario(usuario);
        } catch (HibernateException ex) {
            ex.printStackTrace();
        } finally {
            if (sesion != null) {
                try {
                    sesion.close();
                } catch (HibernateException ex) {
                    ex.printStackTrace();
                }
            }
        }
        return sesionUsuario;
    }

    /**
     * @param nombre Es el nombre de un usuario
     * @param clave Es la clave de un usuario
     * @return El identificador del usuario validado
     */
    @Override
    public long validarUsuario(String nombre, String clave) {
        long idUsuario = 0;
        Session sesion = null;
        try {
            sesion = HibernateUtil.getSessionFactory().openSession();
            Query queryUsuario = sesion.createSQLQuery("SELECT id FROM usuario WHERE nombre=:nombre AND clave=MD5(:clave)").setString("nombre", nombre).setString("clave", clave);
            idUsuario = (queryUsuario.uniqueResult() == null ? new Long(0) : ((BigInteger) queryUsuario.uniqueResult()).longValue());
            sesion.beginTransaction();
        } catch (HibernateException ex) {
            ex.printStackTrace();
        } finally {
            if (sesion != null) {
                try {
                    sesion.close();
                } catch (HibernateException ex) {
                    ex.printStackTrace();
                }
            }
        }

        return idUsuario;
    }

}
