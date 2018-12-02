package modelo.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import modelo.dao.HibernateUtil;
import modelo.pojo.Camino;
import modelo.pojo.Emergencia;
import modelo.pojo.Nodo;
import org.hibernate.Query;
import org.hibernate.Session;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author bjjua
 */
public class GlobalCache {

    public static final String PATH_IMAGENES = "/home/grupocomet/imagenes/first-alert/";// "D:\\MUNI\\";
    public static List<Nodo> Nodos;
    public static List<Camino> Caminos;
    public static List<NodoA> NodosTemporales;

    public static void cargaInicial() {
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            Query queryNodos = sesion.createQuery("FROM Nodo");
            Query queryEmergencias = sesion.createQuery("FROM Emergencia");
            Query queryCaminos = sesion.createQuery("FROM Camino");
            Caminos = queryCaminos.list();
            Nodos = queryNodos.list();
            List<Emergencia> emergencias = queryEmergencias.list();
            for (Nodo nodoTmp : Nodos) {
                for (Emergencia emergencia : emergencias) {
                    if (nodoTmp.getId() == emergencia.getIdNodo()) {
                        Nodos.remove(nodoTmp);
                    }
                }
            }
            cargarNodosTemporales();
            sesion.getTransaction().commit();
            sesion.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void generarVecinos(NodoA nodo) {
        List<Camino> caminosVecinos = GlobalCache.Caminos.stream().filter(v -> v.getIdNodoInicio().equals(nodo.getNodo().getId())).collect(Collectors.toList());
        caminosVecinos.addAll(GlobalCache.Caminos.stream().filter(v -> v.getIdNodoFin().equals(nodo.getNodo().getId())).collect(Collectors.toList()));

        for (Camino camino : caminosVecinos) {
            NodoA nodoVecino = GlobalCache.NodosTemporales.stream().filter(n -> (n.getNodo().getId().equals(camino.getIdNodoInicio()) || n.getNodo().getId().equals(camino.getIdNodoFin())) && n.getNodo().getId() != nodo.getNodo().getId()).findFirst().get();
            if (nodoVecino != null) {
                nodo.AgregarVecino(nodoVecino);
            }
        }
    }

    private static void cargarNodosTemporales() {
        NodosTemporales = new ArrayList<>();
        Nodos.forEach((nodo) -> {
            NodosTemporales.add(new NodoA(nodo));
        });
        NodosTemporales.forEach((nodoTemporal) -> {
            generarVecinos(nodoTemporal);
        });
    }
}
