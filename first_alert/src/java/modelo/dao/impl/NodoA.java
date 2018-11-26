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

/**
 *
 * @author Toshiba
 */
public class NodoA {

    private static int id;//BD
    private Map<Integer, Integer> vecinos; //Dictionary< idNodoVecino , pesoCaminoAlVecino >
    private static int heuristica;//BD
    private static boolean goal;//BD
    private static int x;//BD
    private static int y;//BD
    private List<NodoA> neighbors;//BD

    public NodoA(int id, int heuristica, boolean goal, int x, int y) {
        this.id = id;
        this.heuristica = heuristica;
        this.goal = goal;
        this.Habil = true;
        this.x = x;
        this.y = y;
        vecinos = new HashMap<Integer, Integer>();
        neighbors = new ArrayList();;
    }

    private Map<Integer, Integer> Vecinos;

    NodoA() {
    }

    public Map<Integer, Integer> getVecinos() {
        return vecinos;
    }
    /*
     {
     get =  > vecinos;
     }*/
    private int Id;

    public int getId() {
        return id;
    }
    /*
     {
     get =  > id;
     }*/
    public boolean Habil;
    /*
     {get;set;
     }*/
    public int G;
    /*
     {get;set;
     }*/
    private int H;

    public int getH() {
        return heuristica;
    }
    /*
     {
     get =  > heuristica;
     }*/
    private boolean Goal;

    public boolean getGoal() {
        return goal;
    }
    /*
     {
     get =  > goal;
     }*/
    public NodoA Antecesor;
    /*
     {get;set;
     }*/
    private int X;

    public int getX() {
        return x;
    }
    /*
     {
     get =  > x;
     }
     */
    private int Y;

    public int getY() {
        return y;
    }
    /*
     {
     get =  > y;
     }*/
    private int F;

    public int getF() {
        return this.G + this.heuristica;
    }
    /*
     {
     get =  > this.G + this.heuristica;
     }*/
    private List<NodoA> Neighbors;

    public List<NodoA> getNeighbors() {
        return neighbors;
    }
    /*
     {
     get =  > neighbors;
     }
     */

    public int PesoCaminoVecino(int idNodoVecino) {
        return this.vecinos.get(idNodoVecino);
    }

    public void AgregarVecino(NodoA nodoVecino, int peso) {
        vecinos.put(nodoVecino.Id, peso);
        neighbors.add(nodoVecino);
    }
    /*
     public int id;//BD
     public Map<Integer, Integer> vecinos; //Dictionary< idNodoVecino , pesoCaminoAlVecino >
     public int heuristica;//BD
     public boolean goal;//BD
     public int x;//BD
     public int y;//BD
     public List<NodoA> neighbors;//BD

     public Map<Integer, Integer> Vecinos = vecinos;
     public int Id = id;
     public boolean Habil;
     public int G;
     public int H = heuristica;
     public boolean Goal = goal;
     public NodoA Antecesor;
     public int X = x;
     public int Y = y;
     public int F = this.G + this.heuristica;
     public List<NodoA> Neighbors = neighbors;

     public NodoA(int id, int heuristica, boolean goal, int x, int y) {
     this.Id = id;
     this.heuristica = heuristica;
     this.goal = goal;
     this.Habil = true;
     this.x = x;
     this.y = y;
     }

     NodoA() {

     }

     public int PesoCaminoVecino(int idNodoVecino) {
     return this.vecinos.get(idNodoVecino);
     }

     public void AgregarVecino(NodoA nodoVecino, int peso) {
     vecinos.put(nodoVecino.id, peso);
     neighbors.add(nodoVecino);
     }*/
}
