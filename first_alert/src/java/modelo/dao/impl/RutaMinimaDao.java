/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao.impl;

import java.util.List;

/**
 *
 * @author Toshiba
 */
public class RutaMinimaDao {

    int[][] m0 = { //
        {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}, //
        {1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1}, //
        {1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1}, //
        {1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1}, //
        {1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1}, //
        {1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1}, //
        {1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1}, //
        {1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1}, //
        {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1}, //
        {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}};

    private Map map;
    private List<Node> path;

    public RutaMinimaDao() {
        // Change this to whatever map you want, and feel free to add more.
        int[][] m = m0;
        map = new Map(m);
    }

    public List<Node> calcularRutaMinima(int posX,int posY) {
        int mx = posX;
        int my = posY;
        if (map.getNode(mx, my).isWalkable()) {
            path = map.findPath(1, 1, mx, my);
            System.out.println("path:" + path);
            //player.followPath(path);
        } else {
            System.out.println("Can't walk to that node!");
        }
        return path;
    }

}
