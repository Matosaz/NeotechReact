import React from 'react';
import './Politica.css';

const PrivacyPolicy = () => {

  const Voltarpolitica = () => {
    window.history.back();
  }

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="policy-content">
          <button onClick={Voltarpolitica} className="voltarpolitica">Retornar</button>
          <h1>Política de Privacidade</h1>
          <p className="ultimaatualizacao">Última atualização: 14 de setembro de 2024</p>
          <p>
            Esta Política de Privacidade descreve nossas políticas e procedimentos sobre a coleta, uso e divulgação das suas informações quando você usa o Serviço e informa sobre seus direitos de privacidade e como a lei protege você.
          </p>
          <p>
            Utilizamos seus dados pessoais para fornecer e melhorar o Serviço. Ao usar o Serviço, você concorda com a coleta e uso de informações de acordo com esta Política de Privacidade. Esta Política de Privacidade foi criada com a ajuda do Privacy Policy Generator.
          </p>
          <h2>Interpretação e Definições</h2>
          <h3>Interpretação</h3>
          <p>
            As palavras cujas letras iniciais são maiúsculas têm significados definidos sob as seguintes condições. As seguintes definições terão o mesmo significado independentemente de aparecerem no singular ou no plural.
          </p>
          <h3>Definições</h3>
          <p>Para os fins desta Política de Privacidade:</p>
          <ul>
            <li><strong>Conta:</strong> significa uma conta única criada para que você acesse nosso Serviço ou partes do nosso Serviço.</li>
            <li><strong>Afiliada:</strong> significa uma entidade que controla, é controlada por ou está sob controle comum com uma parte, onde "controle" significa a posse de 50% ou mais das ações, participação acionária ou outros títulos que têm direito a voto para eleição de diretores ou outra autoridade de gestão.</li>
            <li><strong>Empresa:</strong> refere-se à Neotech.</li>
            <li><strong>Cookies:</strong> são pequenos arquivos colocados no seu dispositivo que contêm detalhes do seu histórico de navegação em um site.</li>
            <li><strong>País:</strong> refere-se ao Brasil.</li>
            <li><strong>Dispositivo:</strong> significa qualquer dispositivo que possa acessar o Serviço, como um computador, um telefone celular ou um tablet digital.</li>
            <li><strong>Dados Pessoais:</strong> são quaisquer informações relacionadas a um indivíduo identificado ou identificável.</li>
            <li><strong>Prestador de Serviços:</strong> refere-se a qualquer pessoa física ou jurídica que processa os dados em nome da Empresa.</li>
            <li><strong>Dados de Uso:</strong> são dados coletados automaticamente, gerados pelo uso do Serviço ou da própria infraestrutura do Serviço (por exemplo, a duração de uma visita à página).</li>
            <li><strong>Você:</strong> refere-se ao indivíduo acessando ou usando o Serviço, ou a empresa, ou outra entidade jurídica em nome da qual esse indivíduo está acessando ou usando o Serviço.</li>
          </ul>
          <h2>Coleta e Uso de seus Dados Pessoais</h2>
          <h3>Tipos de Dados Coletados</h3>
          <h4>Dados Pessoais</h4>
          <p>
            Ao usar nosso Serviço, podemos solicitar que você nos forneça certas informações pessoalmente identificáveis que podem ser usadas para contatá-lo ou identificá-lo. Informações pessoalmente identificáveis podem incluir, mas não estão limitadas a: Endereço de e-mail, Nome e sobrenome, Dados de Uso.
          </p>
          <h4>Dados de Uso</h4>
          <p>
            Dados de Uso são coletados automaticamente ao usar o Serviço. Eles podem incluir informações como o endereço de IP do seu dispositivo, tipo de navegador, versão do navegador, páginas do nosso Serviço que você visita, hora e data da sua visita, tempo gasto nessas páginas, identificadores únicos de dispositivo e outros dados de diagnóstico.
          </p>
          <h3>Informações de Serviços de Mídia Social de Terceiros</h3>
          <p>
            A Empresa permite que você crie uma conta e faça login no uso do Serviço por meio dos seguintes Serviços de Mídia Social de Terceiros: Google, Facebook, Instagram, Twitter, LinkedIn.
          </p>
          <h3>Tecnologias de Rastreamento e Cookies</h3>
          <p>
            Utilizamos Cookies e tecnologias semelhantes para monitorar a atividade no nosso Serviço e armazenar certas informações. Você pode instruir seu navegador a recusar todos os Cookies ou a indicar quando um Cookie está sendo enviado.
          </p>
          <h2>Uso dos seus Dados Pessoais</h2>
          <p>A Empresa pode usar os Dados Pessoais para os seguintes fins:</p>
          <ul>
            <li><strong>Para fornecer e manter nosso Serviço:</strong> incluindo monitorar o uso de nosso Serviço.</li>
            <li><strong>Para gerenciar sua Conta:</strong> gerenciar seu registro como usuário do Serviço.</li>
            <li><strong>Para contatá-lo:</strong> por e-mail, chamadas telefônicas ou outras formas de comunicação eletrônica.</li>
          </ul>
          <h2>Retenção dos seus Dados Pessoais</h2>
          <p>
            A Empresa reterá seus Dados Pessoais apenas pelo tempo necessário para os propósitos estabelecidos nesta Política de Privacidade.
          </p>
          <h2>Segurança dos seus Dados Pessoais</h2>
          <p>
            A segurança dos seus Dados Pessoais é importante para nós, mas lembre-se de que nenhum método de transmissão pela Internet ou de armazenamento eletrônico é 100% seguro.
          </p>
          <h2>Privacidade das Crianças</h2>
          <p>
            Nosso Serviço não se destina a menores de 13 anos. Não coletamos intencionalmente informações pessoalmente identificáveis de menores de 13 anos.
          </p>
          <h2>Alterações a esta Política de Privacidade</h2>
          <p>
            Podemos atualizar nossa Política de Privacidade periodicamente. Você é aconselhado a revisar esta Política periodicamente.
          </p>
          <h2>Entre em Contato Conosco</h2>
          <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: <br /><span className="neotechspanpoli">neotech@gmail.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
