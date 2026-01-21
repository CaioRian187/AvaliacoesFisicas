package com.CaioRian.AvaliacoesFisicas.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.CaioRian.AvaliacoesFisicas.exceptions.NotFoundException;
import com.CaioRian.AvaliacoesFisicas.models.Aluno;
import com.CaioRian.AvaliacoesFisicas.repository.AlunoRepository;


@Service
public class AlunoService {
    
    @Autowired
    private AlunoRepository alunoRepository;

    public Aluno findByNome(String nome){
        return alunoRepository.findByNome(nome).orElseThrow( () -> new NotFoundException("Aluno de nome " + nome + " não encontrado."));
    }

    public Aluno findById(Long id){
        Optional<Aluno> aluno = this.alunoRepository.findById(id);
        return aluno.orElseThrow( () -> new NotFoundException("Aluno de id " + id + " não encontrado."));
    }

    public List<Aluno> findAllAlunos(){
        List<Aluno> list = this.alunoRepository.findAll();
        if (list.isEmpty()){
            throw new NotFoundException("Nenhum aluno encontrado.");
        }
        return list;
    }

    @Transactional
    public void createAluno(Aluno aluno){    
        this.alunoRepository.save(aluno);
    }

    @Transactional
    public Aluno updateAluno(Aluno aluno){
        Aluno newAluno = findById(aluno.getId());

        newAluno.setNome(aluno.getNome());
        newAluno.setIdade(aluno.getIdade());
        newAluno.setSexo(aluno.getSexo());

        return this.alunoRepository.save(newAluno);
    }

    public void deleteAluno(Long id){
        findById(id);
        try{
            this.alunoRepository.deleteById(id);
        }
        catch (DataIntegrityViolationException exception){
            throw new DataIntegrityViolationException("Não é possível excluir, pois o aluno possui vinculações");
        }
    }
    
}
