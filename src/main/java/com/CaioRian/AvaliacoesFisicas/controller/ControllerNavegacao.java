package com.CaioRian.AvaliacoesFisicas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ControllerNavegacao {
    @GetMapping("/pag-aluno")
    public String paginaAluno() {
        return "aluno"; // Aqui deve ser o nome exato do arquivo .html sem a extensão
    }

    @GetMapping("/antropometria")
    public String paginaAntropometria() {
        return "antropometria";
    }

    @GetMapping("/dobras-cutaneas")
    public String paginaDobras() {
        return "dobras";
    }
}
