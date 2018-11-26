/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao.impl;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Toshiba
 */
public class PathClass {

    public NodoA StartPoint = new NodoA();
    private List<NodoA> openNodes = new ArrayList();// = new List<NodoA>();
    private List<NodoA> closedNodes = new ArrayList();// = new List<NodoA>();
    NodoA lastCheckedNode;

    public PathClass() {

    }

    public List<NodoA> EncontrarCamino(NodoA start) {
        start.Antecesor = null;
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
            i = i.Antecesor;
        } while (i != null);
        return result;
    }

    private NodoA PathFinder() {
        while (this.openNodes.size() > 0) {
            NodoA current = this.openNodes.get(0);
            for (NodoA item : openNodes) {
                if (item.getF() < current.getF()) {
                    current = item;
                }
                if (item.G > current.G) {
                    current = item;
                }
            }
            this.lastCheckedNode = current;
            if (current.getGoal()) {
                return current;
            }
            openNodes.remove(current);
            closedNodes.add(current);

            boolean existeClose = false;
            boolean existeOpen = false;
            for (NodoA neighbor : current.getNeighbors()) {
                for (NodoA closedNode : closedNodes) {
                    if (closedNode.getId() == neighbor.getId()) {
                        existeClose = true;
                    }
                }
                for (NodoA openNode : openNodes) {
                    if (openNode.getId() == neighbor.getId()) {
                        existeOpen = true;
                    }
                }
                if (!existeClose) {
                    int tempG = current.G + current.PesoCaminoVecino(neighbor.getId());
                    if (!existeOpen) {
                        this.openNodes.add(neighbor);
                    } else if (tempG >= neighbor.G) {
                        continue;
                    }
                    neighbor.G = tempG;
                    neighbor.Antecesor = current;
                }
            }
        }
        return null;
    }
}
