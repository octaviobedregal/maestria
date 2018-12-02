/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import modelo.pojo.Nodo;

/**
 *
 * @author BJ
 */
public class NodoA {

    Nodo nodo;
    ArrayList<NodoA> neighbors;
    Map vecinos = new HashMap();
    int g;

    public int getG() {
        return g;
    }

    public void setG(int g) {
        this.g = g;
    }

    public Nodo getNodo() {
        return nodo;
    }

    public void setNodo(Nodo nodo) {
        this.nodo = nodo;
    }

    public ArrayList<NodoA> getNeighbors() {
        return neighbors;
    }

    public void setNeighbors(ArrayList<NodoA> neighbors) {
        this.neighbors = neighbors;
    }

    public Map getVecinos() {
        return vecinos;
    }

    public void setVecinos(Map vecinos) {
        this.vecinos = vecinos;
    }

    public NodoA getAntecesor() {
        return antecesor;
    }

    public void setAntecesor(NodoA antecesor) {
        this.antecesor = antecesor;
    }
     NodoA antecesor;

    public NodoA(Nodo nodo) {
        this.nodo = nodo;
        neighbors=new ArrayList<>();
        antecesor=null;
    }
    
    public int F(){
        return this.g+this.nodo.getHeuristica();
    }
    
    public int PesoCaminoVecino(long idNodoVecino)
    {
        return (int) this.vecinos.get(idNodoVecino);
    }
    
    public void AgregarVecino(NodoA nodoVecino)
    {
        int peso= Math.abs(this.nodo.getX() - nodoVecino.getNodo().getX()) + Math.abs(this.nodo.getY() - nodoVecino.getNodo().getY());
        vecinos.put(nodoVecino.getNodo().getId(), peso);
        neighbors.add(nodoVecino);
    }
    
}
