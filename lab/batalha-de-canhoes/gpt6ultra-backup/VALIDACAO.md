# Verificação da versão 3.0

Data: 3 de novembro de 2026.

## Executado

16 verificações automatizadas passaram, com Node.js e substitutos de DOM/Canvas para testar a lógica sem navegador:

1. IDs da interface únicos e compatíveis com o código; scripts locais em ordem correta.
2. Respostas vazias, decimais incorretos e textos malformados rejeitados.
3. 1.440 contas geradas e conferidas entre operações e dificuldades.
4. Física idêntica em simulações de 30, 60, 90, 120, 144 e 240 quadros por segundo.
5. Previsão e tiro real coincidentes em 40 cenários de trajetória.
6. Crateras respeitando os limites do terreno.
7. Início da partida e explicação permanecendo disponível para leitura.
8. Respostas repetidas sem duplicar pontuação ou energia.
9. Treino sem prazo, pausa de tempo/projéteis e pausa ao ocultar a aba.
10. Expiração da pergunta e disparo ao terminar o tempo de mira.
11. Custo das armas, limite de energia e seleção visual coerente.
12. Retorno ao menu cancelando resultado pendente; resultado único e sem pontos da IA.
13. Mensagens de tema aceitas somente da janela pai.
14. Mira por ponteiro e atalhos com o controle de ajuste em foco.
15. Tutorial parando o tempo e retornando ao turno.
16. Seis partidas completas: dois modos em três dificuldades, todas encerradas corretamente.

Também foram verificados a sintaxe dos arquivos JavaScript, os metadados do pacote, a estrutura do SVG e a presença dos recursos locais.

## Limites da validação

Os testes usam substitutos das APIs de interface: não verificam aparência, distribuição dos elementos, áudio real ou gestos no aparelho. A ferramenta de navegador desta sessão bloqueou a abertura de arquivos locais. Não houve inspeção visual em navegador nem medição de FPS em computador ou celular. Não se afirma ganho percentual de desempenho.

## Conferência recomendada no portal

- Abrir a versão extraída e jogar uma partida no computador e no celular.
- Conferir as telas de pergunta, mira, pausa, tutorial e resultado em retrato e paisagem.
- Testar som e efeitos reduzidos, arraste e teclado.
- Conferir tema claro/escuro e redimensionamento dentro do portal.
- Confirmar que o portal registra somente os acertos humanos no modo contra a IA.
