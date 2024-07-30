package com.InstaCut.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    private String name;

    private String description;
    @ManyToOne
    @JoinColumn(name="account_id",referencedColumnName = "id",nullable = false)
    private Account account;

}
