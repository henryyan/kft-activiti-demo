package me.kafeitu.demo.activiti.entity.account;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

/**
 * The persistent class for the ACT_ID_USER database table.
 */
@Entity
@Table(name = "ACT_ID_USER")
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String email;
    private String first;
    private String last;
    private String password;
    private List<Group> actIdGroups;

    public User() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID_")
    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Column(name = "EMAIL_")
    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Column(name = "FIRST_")
    public String getFirst() {
        return this.first;
    }

    public void setFirst(String first) {
        this.first = first;
    }

    @Column(name = "LAST_")
    public String getLast() {
        return this.last;
    }

    public void setLast(String last) {
        this.last = last;
    }

    @Column(name = "PWD_")
    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    //bi-directional many-to-many association to Group
    @ManyToMany
    @JoinTable(name = "ACT_ID_MEMBERSHIP", joinColumns = {@JoinColumn(name = "USER_ID_")}, inverseJoinColumns = {@JoinColumn(name = "GROUP_ID_")})
    public List<Group> getActIdGroups() {
        return this.actIdGroups;
    }

    public void setActIdGroups(List<Group> actIdGroups) {
        this.actIdGroups = actIdGroups;
    }

}