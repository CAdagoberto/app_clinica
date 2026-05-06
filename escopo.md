1. Estrutura da Clínica

A instituição é uma clínica escola de psicologia vinculada ao serviço social, onde os atendimentos são realizados por estagiários supervisionados.

A equipe é composta por 94 (atualmente) estagiários e 6 supervisores.

A estrutura física da clínica possui 8 ambientes, sendo:
	•	6 salas de atendimento
	•	1 recepção
	•	1 sala de descanso

Existe uma restrição de uso no Consultórios 1 e 2, que possui horários específicos:
	•	Terça-feira: das 13h às 16h
	•	Quarta-feira: das 13h às 18h
	•	Sexta-feira: das 13h às 18h

O funcionamento da clínica ocorre nos seguintes horários:
	•	Segunda a sexta-feira: das 08h às 20h
	•	Sábado: das 08h às 14h

⸻

2. Estrutura de Agenda

A agenda é organizada por profissional (estagiário).

Cada consulta possui duração padrão de 50 minutos.

O modelo de atendimento da clínica segue uma estrutura fixa: cada paciente realiza 10 sessões consecutivas, mantendo sempre:
	•	o mesmo estagiário
	•	o mesmo dia da semana
	•	o mesmo horário

O sistema deve permitir o agendamento automático das 10 sessões no momento da marcação inicial.

A quantidade de pacientes atendidos depende do estágio do aluno:
	•	Estágio 1: até 2 pacientes
	•	Estágio 2: até 3 pacientes
	•	Estágio 3: até 3 pacientes

⸻

3. Cadastro de Pacientes

O sistema deve registrar as seguintes informações obrigatórias para cada paciente:
	•	Nome
	•	Telefone
	•	Localização ou região do paciente
	•	Número de prontuário

Caso o paciente seja menor de idade, deve existir cadastro obrigatório do responsável legal.

Cada paciente terá um histórico clínico vinculado ao prontuário, contendo:
	•	profissional responsável
	•	relatórios de atendimento
	•	histórico completo das consultas realizadas.

⸻

4. Cadastro de Estagiários

O cadastro dos estagiários deve incluir:
	•	Nome
	•	Número de matrícula
	•	Estágio atual

O sistema também deverá registrar controle de presença e pontualidade dos estagiários na clínica.

Cada estagiário permanece no estágio por aproximadamente 3 semestres.

⸻

5. Controle de Usuários

O sistema possuirá três níveis de acesso diferentes:

Administração / Supervisores
	•	acesso completo ao sistema
	•	controle geral da clínica
	•	supervisão dos atendimentos

Estagiários
	•	acesso apenas aos próprios pacientes
	•	registro de relatórios de atendimento
	•	visualização da própria agenda

Pacientes
	•	acesso ao aplicativo para visualizar consultas
	•	confirmação ou cancelamento de atendimento

Cada usuário do sistema deverá possuir login e senha próprios, definidos individualmente.

⸻

6. Aplicativos do Sistema

O sistema será composto por três versões de aplicativo:

Aplicativo Administrativo

Utilizado pela gestão da clínica para:
	•	controle geral da clínica
	•	gestão de usuários
	•	controle de salas
	•	acompanhamento de atendimentos
	•	avaliação da clínica e dos estagiários

Aplicativo do Estagiário

Utilizado pelos estagiários para:
	•	consultar agenda
	•	registrar presença
	•	registrar relatórios de atendimento
	•	acessar prontuários dos pacientes atendidos
	•	participar do sistema de avaliação acadêmica

Aplicativo do Paciente

Utilizado pelos pacientes para:
	•	confirmar consultas
	•	cancelar consultas
	•	receber notificações e lembretes.

⸻

7. Sistema de Comunicação

O sistema deve possuir um módulo de notificações automáticas.

Essas notificações serão utilizadas para:
	•	confirmação de agendamento
	•	lembrete de consultas
	•	cancelamento de atendimento
	•	confirmação de retorno no início do semestre

As notificações poderão ser enviadas por:
	•	aplicativo do sistema
	•	WhatsApp.

⸻

8. Sistema de Encaminhamento

O sistema deverá possuir um módulo de encaminhamento de pacientes.

Esse encaminhamento poderá ocorrer de duas formas:

Encaminhamento interno
	•	redirecionamento do paciente para outro estagiário disponível.

Encaminhamento externo
	•	encaminhamento para profissionais ou serviços externos.

Também será necessário registrar a região do paciente, para facilitar o encaminhamento adequado.

⸻

9. Regras de Atendimento

O processo de atendimento da clínica segue o seguinte fluxo:
	1.	Realização da triagem do paciente.
	2.	Cadastro do paciente no sistema.
	3.	Definição do estagiário responsável pelo atendimento.
	4.	Agendamento automático das 10 consultas consecutivas, mantendo o mesmo dia e horário semanal.
	5.	Envio de confirmação de consulta para o paciente.
	6.	Registro do atendimento e relatório após cada sessão.

⸻

10. Cancelamento e Reagendamento

O sistema deve permitir:
	•	confirmação de presença
	•	cancelamento de consultas
	•	reagendamento de atendimentos.

Caso ocorra cancelamento ou falta do paciente, o sistema deverá permitir o usuário realocar o atendimento para outro dia disponível, obrigatoriamente mantendo o mesmo estagiário. Caso o estagiário não esteja disponível ou o paciente negar deve cancelar a consulta.

⸻

11. Avaliação da Clínica

O sistema deverá possuir funcionalidades para:

Avaliação dos estagiários
	•	realizada por supervisores ou coordenação e pacientes (após a consulta).

Avaliação da clínica
	•	realizada por pacientes ou pela administração.

⸻

12. Problemas Identificados Atualmente

Os principais problemas observados no funcionamento atual da clínica são:
	•	excesso de fluxo de informações
	•	desorganização na comunicação entre pacientes e estagiários
	•	dificuldades no controle da agenda
	•	ausência de um sistema digital centralizado.

⸻

13. Requisitos Técnicos Importantes

Existe uma limitação importante na infraestrutura da clínica:

As salas de atendimento não possuem acesso à internet.

Portanto, o sistema deve considerar a possibilidade de:
	•	funcionamento offline
	•	sincronização de dados quando houver conexão disponível.

⸻

14. Requisitos Não Funcionais

O sistema deverá atender aos seguintes requisitos gerais:
	•	interface simples e fácil de utilizar
	•	funcionamento contínuo (24 horas por dia)
	•	notificações visuais claras para os usuários
	•	controle de acesso por nível de usuário
	•	desenvolvimento e manutenção sem custos, pois a clínica oferece atendimento gratuito.

⸻

15. Expectativas da Clínica

A clínica espera que o sistema permita:
	•	melhorar a comunicação entre pacientes e estagiários
	•	aumentar a confiança no processo de atendimento
	•	organizar melhor a agenda da clínica
	•	reduzir erros de agendamento
	•	oferecer confirmações e notificações claras e visuais para os pacientes.