/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao.impl;

import java.util.List;
import modelo.dao.HibernateUtil;
import modelo.dao.IEmergenciaDao;
import modelo.pojo.Emergencia;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author octavio
 */
public class EmergenciaDao implements IEmergenciaDao {

    @Override
    public boolean guardarEmergencia(Long idMapa, List<Emergencia> emergencias) {
        boolean guardado = false;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            String hqlEmergencia = "DELETE FROM Emergencia WHERE idMapa= :idMapa";
            sesion.createQuery(hqlEmergencia).setLong("idMapa", idMapa).executeUpdate();

            for (Emergencia emergencia : emergencias) {
                sesion.save(emergencia);
            }
            sesion.getTransaction().commit();
            sesion.close();
            guardado = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return guardado;
    }

    @Override
    public List<Emergencia> listarEmergencias(Long idMapa) {
        List<Emergencia> lista = null;
        try {
            Session sesion = HibernateUtil.getSessionFactory().openSession();
            sesion.beginTransaction();
            Query query = sesion.createQuery("from Emergencia WHERE idMapa=:idMapa order by id");
            lista = query.setLong("idMapa", idMapa).list();
            sesion.getTransaction().commit();
            sesion.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return lista;
    }

}
