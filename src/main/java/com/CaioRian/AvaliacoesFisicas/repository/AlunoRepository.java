package com.CaioRian.AvaliacoesFisicas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CaioRian.AvaliacoesFisicas.models.Aluno;

public interface AlunoRepository extends JpaRepository<Aluno, Long>{
    
}
