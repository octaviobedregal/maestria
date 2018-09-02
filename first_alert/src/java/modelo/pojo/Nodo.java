package modelo.pojo;
// Generated 01-sep-2018 18:24:08 by Hibernate Tools 4.3.1


import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * Nodo generated by hbm2java
 */
@Entity
@Table(name="nodo"
    ,schema="public"
)
public class Nodo  implements java.io.Serializable {


     private long id;
     private Mapa mapa;
     private String codigo;
     private long x;
     private long y;
     private boolean objetivo;
     private Set<Emergencia> emergencias = new HashSet<Emergencia>(0);
     private Set<Camino> caminosForIdNodoFin = new HashSet<Camino>(0);
     private Set<Camino> caminosForIdNodoInicio = new HashSet<Camino>(0);

    public Nodo() {
    }

	
    public Nodo(long id, Mapa mapa, String codigo, long x, long y, boolean objetivo) {
        this.id = id;
        this.mapa = mapa;
        this.codigo = codigo;
        this.x = x;
        this.y = y;
        this.objetivo = objetivo;
    }
    public Nodo(long id, Mapa mapa, String codigo, long x, long y, boolean objetivo, Set<Emergencia> emergencias, Set<Camino> caminosForIdNodoFin, Set<Camino> caminosForIdNodoInicio) {
       this.id = id;
       this.mapa = mapa;
       this.codigo = codigo;
       this.x = x;
       this.y = y;
       this.objetivo = objetivo;
       this.emergencias = emergencias;
       this.caminosForIdNodoFin = caminosForIdNodoFin;
       this.caminosForIdNodoInicio = caminosForIdNodoInicio;
    }
   
     @Id 

    
    @Column(name="id", unique=true, nullable=false)
    public long getId() {
        return this.id;
    }
    
    public void setId(long id) {
        this.id = id;
    }

@ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="id_mapa", nullable=false)
    public Mapa getMapa() {
        return this.mapa;
    }
    
    public void setMapa(Mapa mapa) {
        this.mapa = mapa;
    }

    
    @Column(name="codigo", nullable=false)
    public String getCodigo() {
        return this.codigo;
    }
    
    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    
    @Column(name="x", nullable=false)
    public long getX() {
        return this.x;
    }
    
    public void setX(long x) {
        this.x = x;
    }

    
    @Column(name="y", nullable=false)
    public long getY() {
        return this.y;
    }
    
    public void setY(long y) {
        this.y = y;
    }

    
    @Column(name="objetivo", nullable=false)
    public boolean isObjetivo() {
        return this.objetivo;
    }
    
    public void setObjetivo(boolean objetivo) {
        this.objetivo = objetivo;
    }

@OneToMany(fetch=FetchType.LAZY, mappedBy="nodo")
    public Set<Emergencia> getEmergencias() {
        return this.emergencias;
    }
    
    public void setEmergencias(Set<Emergencia> emergencias) {
        this.emergencias = emergencias;
    }

@OneToMany(fetch=FetchType.LAZY, mappedBy="nodoByIdNodoFin")
    public Set<Camino> getCaminosForIdNodoFin() {
        return this.caminosForIdNodoFin;
    }
    
    public void setCaminosForIdNodoFin(Set<Camino> caminosForIdNodoFin) {
        this.caminosForIdNodoFin = caminosForIdNodoFin;
    }

@OneToMany(fetch=FetchType.LAZY, mappedBy="nodoByIdNodoInicio")
    public Set<Camino> getCaminosForIdNodoInicio() {
        return this.caminosForIdNodoInicio;
    }
    
    public void setCaminosForIdNodoInicio(Set<Camino> caminosForIdNodoInicio) {
        this.caminosForIdNodoInicio = caminosForIdNodoInicio;
    }




}


