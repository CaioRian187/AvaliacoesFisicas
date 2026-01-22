package com.CaioRian.AvaliacoesFisicas.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.CaioRian.AvaliacoesFisicas.exceptions.NotFoundException;
import com.CaioRian.AvaliacoesFisicas.models.Circunferencias;
import com.CaioRian.AvaliacoesFisicas.repository.CircunferenciasRepository;

@Service
public class CircunferenciasService {
    
    @Autowired
    private CircunferenciasRepository circunferenciasRepository;

    public Circunferencias findById(Long id){
        Optional<Circunferencias> circunferencia = this.circunferenciasRepository.findById(id);
        return circunferencia.orElseThrow( () -> new NotFoundException("Circunferências de id " + id + " não encontradas."));
    }

    public List<Circunferencias> findAllByAlunoId(Long alunoId){
        List<Circunferencias> list = this.circunferenciasRepository.findByAluno_id(alunoId);
        if (list.isEmpty()){
            throw new NotFoundException("Nehuma circunferência encontrada");
        }
        return list;
    }

    public List<Circunferencias> findAll(){
        List<Circunferencias> list = this.circunferenciasRepository.findAll();
        if (list.isEmpty()){
            throw new NotFoundException("Nenhuma circunferência encontrada.");
        }
        return list;
    }

    @Transactional
    public void createCircunferencia(Circunferencias circunferencias){
        circunferencias.setImc(circunferencias.getPeso()/(circunferencias.getAltura()*circunferencias.getAltura()));
        this.circunferenciasRepository.save(circunferencias);
    }

    @Transactional
    public Circunferencias updateCircunferencias(Circunferencias circunferencias){
        Circunferencias newCircunferencias = this.findById(circunferencias.getId());

        newCircunferencias.setData(circunferencias.getData());
        newCircunferencias.setAltura(circunferencias.getAltura());
        newCircunferencias.setPeso(circunferencias.getPeso());
        newCircunferencias.setImc(circunferencias.getPeso()/(circunferencias.getAltura()*circunferencias.getAltura()));
        newCircunferencias.setOmbro(circunferencias.getOmbro());
        newCircunferencias.setCintura(circunferencias.getCintura());
        newCircunferencias.setQuadril(circunferencias.getQuadril());
        newCircunferencias.setPeitoral(circunferencias.getPeitoral());
        newCircunferencias.setAbdommen(circunferencias.getAbdommen());
        newCircunferencias.setCoxaProximalEsquerda(circunferencias.getCoxaProximalEsquerda());
        newCircunferencias.setCoxaProximalDireita(circunferencias.getCoxaProximalDireita());
        newCircunferencias.setCoxaMedialEsquerda(circunferencias.getCoxaMedialEsquerda());
        newCircunferencias.setCoxaMedialDireita(circunferencias.getCoxaMedialDireita());
        newCircunferencias.setCoxaDistalEsquerda(circunferencias.getCoxaDistalEsquerda());
        newCircunferencias.setCoxaDistalDireita(circunferencias.getCoxaDistalDireita());
        newCircunferencias.setPanturrilhaEsquerda(circunferencias.getPanturrilhaEsquerda());
        newCircunferencias.setPanturrilhaDireita(circunferencias.getPanturrilhaDireita());
        newCircunferencias.setBracoRelaxadoEsquerdo(circunferencias.getBracoRelaxadoEsquerdo());
        newCircunferencias.setBracoRelaxadoDireito(circunferencias.getBracoRelaxadoDireito());
        newCircunferencias.setBracoContraidoEsquerdo(circunferencias.getBracoContraidoEsquerdo());
        newCircunferencias.setBracoContraidoDireito(circunferencias.getBracoContraidoDireito());
        newCircunferencias.setAntebraçoEsquerdo(circunferencias.getAntebraçoEsquerdo());
        newCircunferencias.setAntebraçoDireito(circunferencias.getAntebraçoDireito());

        return this.circunferenciasRepository.save(newCircunferencias);
    }

    public void deletarCircunferencia(Long id){
        findById(id);

        try{
            this.circunferenciasRepository.deleteById(id);
        }
        catch(DataIntegrityViolationException exception){
            throw new DataIntegrityViolationException("Não é possível excluir, pois as circunferências possuim vinculações");
        }
    }
}
