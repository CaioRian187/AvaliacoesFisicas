package com.CaioRian.AvaliacoesFisicas.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.CaioRian.AvaliacoesFisicas.models.Aluno;
import com.CaioRian.AvaliacoesFisicas.services.AlunoService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@RestController
@RequestMapping("/aluno")
@Validated
public class AlunoController {
    
    @Autowired
    private AlunoService alunoService;

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> findById(@PathVariable Long id){
        Aluno aluno = this.alunoService.findById(id);

        return ResponseEntity.ok().body(aluno);
    }

    @GetMapping("nome/{nome}")
    public ResponseEntity<Aluno> findbyNome(@Valid @PathVariable String nome){
        Aluno aluno = this.alunoService.findByNome(nome);
        return ResponseEntity.ok().body(aluno);
    }


    @GetMapping
    public ResponseEntity<List<Aluno>> findAll(){
        List<Aluno> list = this.alunoService.findAllAlunos();
        return ResponseEntity.ok().body(list);
    }

    @PostMapping
    public ResponseEntity<Void> createAluno(@Valid @RequestBody Aluno aluno){
        this.alunoService.createAluno(aluno);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(aluno.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateAluno(@PathVariable Long id, @Valid @RequestBody Aluno aluno){
        aluno.setId(id);
        aluno = this.alunoService.updateAluno(aluno);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAluno(@PathVariable Long id){
        this.alunoService.deleteAluno(id);
        return ResponseEntity.noContent().build();
    }
}
