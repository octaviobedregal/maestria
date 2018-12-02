/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao.impl;

import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import modelo.dao.HibernateUtil;
import modelo.dao.IMapaDao;
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
    public void guardarMapa(Mapa mapa) {
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

            if (mapa.getId() != null && mapa.getId() > 0) {
                String hqlEmergencia = "DELETE FROM Emergencia WHERE idMapa= :idMapa";
                String hqlCamino = "DELETE FROM Camino WHERE idMapa= :idMapa";
                String hqlNodo = "DELETE FROM Nodo WHERE idMapa= :idMapa";
                sesion.createQuery(hqlEmergencia).setLong("idMapa", mapa.getId()).executeUpdate();
                sesion.createQuery(hqlCamino).setLong("idMapa", mapa.getId()).executeUpdate();
                sesion.createQuery(hqlNodo).setLong("idMapa", mapa.getId()).executeUpdate();
                sesion.update(mapa);
            } else {
                sesion.save(mapa);
            }
            mapa.getNodos().stream().forEach((nodo) -> {
                nodo.setId(new Long(0));
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
                camino.setId(new Long(0));
                sesion.save(camino);
            });

            if (mapa.getNuevoPath() != null && mapa.getNuevoPath()) {
                String imageString = mapa.getContentPath().split(",")[1];
                BASE64Decoder decoder = new BASE64Decoder();
                byte[] bytesMapa = decoder.decodeBuffer(imageString);
                String path = GlobalCache.PATH_IMAGENES + mapa.getId() + ".png";

                FileOutputStream stream = new FileOutputStream(path);
                try {
                    stream.write(bytesMapa);
                    stream.close();
                    mapa.setPath(mapa.getId().toString());
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                }
            }
            sesion.getTransaction().commit();
            sesion.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Mapa buscarMapaPorId(long idMapa) {
        Mapa mapa = null;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            mapa = (Mapa) sesion.load(Mapa.class, idMapa);
            Query queryNodos = sesion.createQuery("FROM Nodo WHERE idMapa=:idMapa  ORDER BY id");
            Query queryCaminos = sesion.createQuery("FROM Camino WHERE idMapa=:idMapa  ORDER BY id");
            List<Camino> caminos = queryCaminos.setLong("idMapa", idMapa).list();
            List<Nodo> nodos = queryNodos.setLong("idMapa", idMapa).list();
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
    public Mapa buscarMapaPorCodigo(String codigoNodo) {
        GlobalCache.cargaInicial();
        Mapa mapa = null;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            Nodo nodo = GlobalCache.Nodos.stream().filter(n -> n.getCodigo().compareTo(codigoNodo) == 0).findFirst().get();
            mapa = (Mapa) sesion.load(Mapa.class, nodo.getIdMapa());
            Query queryNodos = sesion.createQuery("FROM Nodo WHERE idMapa=:idMapa  ORDER BY id");
            Query queryCaminos = sesion.createQuery("FROM Camino WHERE idMapa=:idMapa  ORDER BY id");
            List<Camino> caminos = queryCaminos.setLong("idMapa", mapa.getId()).list();
            List<Nodo> nodos = queryNodos.setLong("idMapa", mapa.getId()).list();
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
    public boolean eliminarMapa(long idMapa) {
        boolean eliminado = false;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            String hqlEmergencia = "DELETE FROM Emergencia WHERE idMapa= :idMapa";
            String hqlCamino = "DELETE FROM Camino WHERE idMapa= :idMapa";
            String hqlNodo = "DELETE FROM Nodo WHERE idMapa= :idMapa";
            String hqlMapa = "DELETE FROM Mapa WHERE id= :idMapa";
            sesion.createQuery(hqlEmergencia).setLong("idMapa", idMapa).executeUpdate();
            sesion.createQuery(hqlCamino).setLong("idMapa", idMapa).executeUpdate();
            sesion.createQuery(hqlNodo).setLong("idMapa", idMapa).executeUpdate();
            sesion.createQuery(hqlMapa).setLong("idMapa", idMapa).executeUpdate();
            sesion.getTransaction().commit();
            sesion.close();
            eliminado = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return eliminado;
    }

    @Override
    public List<Mapa> listarMapas() {
        List<Mapa> lista = null;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            Query query = sesion.createQuery("FROM Mapa ORDER BY id DESC");
            lista = query.list();
            sesion.getTransaction().commit();
            sesion.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return lista;
    }

//BJ    
    @Override
    public List<Long> buscarRutaCritica(String codigoNodo) {
        GlobalCache.cargaInicial();
        List<Long> result = new ArrayList();
        try {
            NodoA nodoInicio = GlobalCache.NodosTemporales.stream().filter(n -> n.getNodo().getCodigo().compareTo(codigoNodo) == 0).findFirst().get();
            PathClass path = new PathClass();
            return path.EncontrarCamino(nodoInicio);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
