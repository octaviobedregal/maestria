/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao;

import java.io.FileOutputStream;
import java.util.List;
import modelo.pojo.Camino;
import modelo.pojo.Mapa;
import modelo.pojo.Nodo;
import org.hibernate.Hibernate;
import org.hibernate.Query;
import org.hibernate.Session;
import sun.misc.BASE64Decoder;

/**
 *
 * @author octavio
 */
public class MapaDao implements IMapaDao {

    @Override
    public void crear(Mapa mapa) {
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            sesion.save(mapa);
            mapa.getNodos().stream().forEach((nodo) -> {
                nodo.setIdMapa(mapa.getId());
                sesion.save(nodo);
            });
            mapa.getCaminos().stream().forEach((camino) -> {
                camino.setIdMapa(mapa.getId());
                mapa.getNodos().stream().forEach((nodo) -> {
                    if (camino.getIdNodoFin() == nodo.getNumero()) {
                        camino.setIdNodoFin(nodo.getId());
                    }
                    if (camino.getIdNodoInicio() == nodo.getNumero()) {
                        camino.setIdNodoInicio(nodo.getId());
                    }
                });
                sesion.save(camino);
            });

            if (mapa.getNuevoPath()) {
                String imageString = mapa.getContentPath().split(",")[1];
                BASE64Decoder decoder = new BASE64Decoder();
                byte[] bytesMapa = decoder.decodeBuffer(imageString);
                String path = "D:\\MUNI\\" + mapa.getId() + ".png";

                FileOutputStream stream = new FileOutputStream(path);
                try {
                    stream.write(bytesMapa);
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    stream.close();
                    mapa.setPath(path);
                }
            }
            sesion.getTransaction().commit();
            sesion.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void editar(Mapa producto) {
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            String hqlUpdate = "update Mapa set nombre = :nombre,descripcion = :descripcion,unidad = :unidad,precioCompra = :precioCompra,precioVenta = :precioVenta where id = :id";
            /*
             sesion.createQuery(hqlUpdate)
             .setString("nombre", producto.getNombre())
             .setString("descripcion", producto.getDescripcion())
             .setString("unidad", producto.getUnidad().getCodigo())
             .setDouble("precioCompra", producto.getPrecioCompra())
             .setDouble("precioVenta", producto.getPrecioVenta())
             .setLong("id", producto.getId())
             .executeUpdate();
             sesion.getTransaction().commit();
             sesion.close();*/
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Mapa buscar(long id) {
        Mapa producto = null;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            producto = (Mapa) sesion.load(Mapa.class, id);
            Hibernate.initialize(producto);
            sesion.getTransaction().commit();
            sesion.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return producto;
    }

    @Override
    public void eliminar(long id) {
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            String hql = "delete from Mapa where id= :id";
            sesion.createQuery(hql).setLong("id", id).executeUpdate();
            sesion.getTransaction().commit();
            sesion.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<Mapa> listar() {
        List<Mapa> lista = null;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            Query query = sesion.createQuery("from Mapa order by id");
            lista = query.list();
            sesion.getTransaction().commit();
            sesion.close();
            //System.out.println("query " + query);
            //System.out.println("listar " + lista);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return lista;
    }

    @Override
    public List<Mapa> autocompletar(String criterio) {
        List<Mapa> lista = null;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            Query query = sesion.createQuery("FROM Mapa WHERE UPPER(nombre) LIKE UPPER(:criterio) order by id").setString("criterio", "%" + criterio + "%");
            lista = query.list();
            sesion.getTransaction().commit();
            sesion.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return lista;
    }

}
