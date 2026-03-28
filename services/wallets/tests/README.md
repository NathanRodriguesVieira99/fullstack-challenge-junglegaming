# Não descobri uma forma de testar o kafka nos testes E2E nos módulos de transações (débito e crédito), pois como crédito e débito não são expostos via REST e acontecem via message broker não descobri uma forma de escrever testes para isso pois os controllers não são rest, apenas consegui escrever testes unitários com o kafka mockado

## Os imports nos arquivos de teste ficaram grandes por que, por algum motivo o vitest não estava conseguindo resolver os paths customizado no tsconfig.json, então apenas para agilizar o processo eu usei os caminhos na forma padrão
