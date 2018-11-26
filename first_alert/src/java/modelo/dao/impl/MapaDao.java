/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao.impl;

import controlador.JsonTransformer;
import controlador.JsonTransformerImplJackson;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import modelo.dao.HibernateUtil;
import modelo.dao.IMapaDao;
import modelo.pojo.Camino;
import modelo.pojo.Mapa;
import modelo.pojo.Nodo;
import org.hibernate.Hibernate;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import sun.misc.BASE64Decoder;

/**
 *
 * @author octavio
 */
public class MapaDao implements IMapaDao {

    @Override
    public void crear(Mapa mapa) {
        List<Nodo> objectivos = new ArrayList();
        List<Nodo> noObjectivos = new ArrayList();

        mapa.getNodos().stream().forEach((nodo) -> {
            if (nodo.isObjetivo()) {
                objectivos.add(nodo);
            } else {
                noObjectivos.add(nodo);
            }
        });

        for (Nodo objetivo : objectivos) {
            for (Nodo noObjetivo : noObjectivos) {
                int heuristica = Math.abs(noObjetivo.getX() - objetivo.getX()) + Math.abs(noObjetivo.getY() - objetivo.getY());
                if (noObjetivo.getHeuristica() == 0 || noObjetivo.getHeuristica() > heuristica) {
                    noObjetivo.setHeuristica(heuristica);
                }
            }
        }

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
                    if (camino.getNumeroNodoFin() == nodo.getNumero()) {
                        camino.setIdNodoFin(nodo.getId());
                    }
                    if (camino.getNumeroNodoInicio() == nodo.getNumero()) {
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

    public void calcularHeuristica() {

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
        Mapa mapa = null;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            mapa = (Mapa) sesion.load(Mapa.class, id);
            Query queryNodos = sesion.createQuery("FROM Nodo WHERE idMapa=:idMapa  ORDER BY id");
            Query queryCaminos = sesion.createQuery("FROM Camino WHERE idMapa=:idMapa  ORDER BY id");
            List<Camino> caminos = queryCaminos.setLong("idMapa", id).list();
            List<Nodo> nodos = queryNodos.setLong("idMapa", id).list();
            mapa.setNodos(nodos);
            mapa.setCaminos(caminos);
            Hibernate.initialize(mapa);
            sesion.getTransaction().commit();
            sesion.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mapa;
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

    public Nodo buscarNodo(List<Nodo> nodos, Long id) {
        for (Nodo nodo : nodos) {
            if (nodo.getId() == id) {
                return nodo;
            }
        }
        return null;
    }

    List<Integer> ids = new ArrayList();

    public boolean buscarIdNodo(NodoA nodo, int id) {
        boolean encontrado = false;
        int cont = 0;
        for (Integer idTmp : ids) {
            if (idTmp == id) {
                cont++;
            }
        }
        encontrado = (cont > 1 ? true : false);
        return encontrado;
    }
    int cont = 0;

    public void encontrarCaminos(NodoA nodoA, Integer id, NodoA vecino, Integer peso) {
        if (cont == 0) {
            if (nodoA.getId() == id) {
                nodoA.AgregarVecino(vecino, peso);
                System.out.println("nodoATmp0:" + jsonTransformer.toJson(nodoA));
            }
            cont++;
        } else {
            for (NodoA nodoATmp : nodoA.getNeighbors()) {
                if (nodoATmp.getId() == id) {
                    nodoATmp.AgregarVecino(vecino, peso);
                    System.out.println("nodoATmp:" + jsonTransformer.toJson(nodoATmp));
                } else {
                    encontrarCaminos(nodoATmp, id, vecino, peso);
                }
            }
        }
    }

    @Autowired
    JsonTransformer jsonTransformer;

    @Override
    public List<NodoA> buscarRutaCritica(String codigoNodo) {
        List<NodoA> result = new ArrayList();
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            Query queryNodo = sesion.createQuery("FROM Nodo WHERE codigo=:codigoNodo").setString("codigoNodo", "" + codigoNodo + "");
            Nodo nodoInicio = (Nodo) queryNodo.uniqueResult();

            Query queryNodos = sesion.createQuery("FROM Nodo WHERE idMapa=:idMapa  ORDER BY id");
            Query queryCaminos = sesion.createQuery("FROM Camino WHERE idMapa=:idMapa  ORDER BY id");
            List<Camino> caminos = queryCaminos.setLong("idMapa", nodoInicio.getIdMapa()).list();
            List<Nodo> nodos = queryNodos.setLong("idMapa", nodoInicio.getIdMapa()).list();

            NodoA nodoA = new NodoA(nodoInicio.getId().intValue(), 0, nodoInicio.isObjetivo(), nodoInicio.getX(), nodoInicio.getY());

            for (Nodo nodo : nodos) {
                for (Camino camino : caminos) {
                    if (nodo.getId() == camino.getIdNodoInicio()) {
                        NodoA nodoVecino = new NodoA(nodo.getId().intValue(), nodo.getHeuristica(), nodo.isObjetivo(), nodo.getX(), nodo.getY());
                        System.out.println("vecino Inicio:" + jsonTransformer.toJson(nodoVecino));
                        //nodoA.AgregarVecino(nodoVecino, camino.getPeso());
                        encontrarCaminos(nodoA, nodo.getId().intValue(), nodoVecino, camino.getPeso());

                    } else if (nodo.getId() == camino.getIdNodoFin()) {
                        NodoA nodoVecino = new NodoA(nodo.getId().intValue(), nodo.getHeuristica(), nodo.isObjetivo(), nodo.getX(), nodo.getY());
                        System.out.println("vecino fin:" + jsonTransformer.toJson(nodoVecino));
                        //nodoA.AgregarVecino(nodoVecino, camino.getPeso());
                        encontrarCaminos(nodoA, nodo.getId().intValue(), nodoVecino, camino.getPeso());

                    }
                }
                System.out.println("nodo Final0:" + jsonTransformer.toJson(nodoA));
            }
            System.out.println("nodo Final:" + jsonTransformer.toJson(nodoA));

            sesion.getTransaction().commit();
            sesion.close();
            //PathClass path = new PathClass();
            result.add(nodoA);//path.EncontrarCamino(nodoA);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}
