/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import modelo.dao.HibernateUtil;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author BJ
 */
public class PathClass {

    public NodoA StartPoint;
    private List<NodoA> openNodes = new ArrayList();// = new List<NodoA>();
    private List<NodoA> closedNodes = new ArrayList();// = new List<NodoA>();
    NodoA lastCheckedNode;
    private List<NodoA> emergenciaNodes = new ArrayList();
    
    public PathClass() {

    }
    
    public void cargarNodosEnEmergencia(long mapId){
        Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            Query queryNodosEmergencia = sesion.createQuery("FROM Emergencia WHERE idMapa = mapId ");
            emergenciaNodes=queryNodosEmergencia.list();
            sesion.getTransaction().commit();
            sesion.close();
    }

    /* Devuelve lista de nodos
    public List<NodoA> EncontrarCamino(NodoA start) {
        start.setAntecesor(null);
        openNodes.add(start);
        lastCheckedNode = start;
        NodoA finalA = PathFinder();
        List<NodoA> result = new ArrayList();//new List<NodoA>();
        if (finalA == null) {
            result.add(start);
            return result;
        }
        NodoA i = finalA;
        do {
            result.add(i);
            i = i.getAntecesor();
        } while (i != null);
        return result;
    }
    */
    
    public List<Long> EncontrarCamino(NodoA start) {
        start.setAntecesor(null);
        openNodes.add(start);
        lastCheckedNode = start;
        NodoA finalA = PathFinder();
        List<Long> result = new ArrayList();
        if (finalA == null) {
            result.add(start.getNodo().getId());
            return result;
        }
        NodoA i = finalA;
        do {
            result.add(i.getNodo().getId());
            i = i.getAntecesor();
        } while (i != null);
        return result;
    }
    
    private NodoA PathFinder() {      
        
        while (this.openNodes.size() > 0) {
            NodoA current = this.openNodes.get(0);
            for (NodoA item : openNodes) {
                if (item.F() < current.F()) {
                    current = item;
                }
                if (item.getG() > current.getG()) {
                    current = item;
                }
            }
            this.lastCheckedNode = current;
            if (current.getNodo().isObjetivo()) {
                return current;
            }
            openNodes.remove(current);
            closedNodes.add(current);

            for (NodoA neighbor : current.getNeighbors()) {              
                if (!(closedNodes.stream().filter(n->n.getNodo().getId().equals(neighbor.getNodo().getId())).count()>0 || (emergenciaNodes != null && emergenciaNodes.stream().filter(n->n.getNodo().getId().equals(neighbor.getNodo().getId())).count()>0))) {
                    int tempG = current.getG() + current.PesoCaminoVecino(neighbor.getNodo().getId());
                    if (!(openNodes.stream().filter(n->n.getNodo().getId().equals(neighbor.getNodo().getId())).count()>0)) {
                        this.openNodes.add(neighbor);
                    } else if (tempG >= neighbor.getG()) {
                        continue;
                    }
                    neighbor.setG(tempG);
                    neighbor.setAntecesor(current);
                }
            }
        }
        return null;
    }
}
