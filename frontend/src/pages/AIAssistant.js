import React, { useState } from 'react';
import styled from 'styled-components';

const AIContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl};
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.gray[900]};
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Objective = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.gray[700]};
  font-size: ${props => props.theme.fontSizes.base};
  
  &::before {
    content: '→';
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.primary};
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChatSection = styled.div`
  background: ${props => props.theme.colors.white};
  border: 2px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const BrowserBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 2px solid ${props => props.theme.colors.gray[200]};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const BrowserDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.gray[400]};
`;

const ChatMessages = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Message = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  align-items: flex-start;
`;

const RobotIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${props => props.theme.colors.gray[200]};
  border: 2px solid ${props => props.theme.colors.gray[400]};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes['2xl']};
  flex-shrink: 0;
`;

const MessageBubble = styled.div`
  background-color: ${props => props.isUser ? props.theme.colors.gray[900] : props.theme.colors.gray[100]};
  color: ${props => props.isUser ? props.theme.colors.white : props.theme.colors.gray[900]};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  flex: 1;
  font-size: ${props => props.theme.fontSizes.base};
  line-height: 1.6;
`;

const ChartPreview = styled.div`
  background-color: ${props => props.theme.colors.gray[100]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const ChartSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

const AlertsBox = styled.div`
  background-color: ${props => props.theme.colors.white};
  border: 2px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[800]};
  
  &::before {
    content: '!';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: ${props => props.theme.colors.gray[900]};
    color: ${props => props.theme.colors.white};
    border-radius: 50%;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  & + & {
    margin-top: ${props => props.theme.spacing.sm};
  }
`;

const RecommendationsPanel = styled.div`
  background: ${props => props.theme.colors.white};
  border: 2px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const PanelTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 3px solid ${props => props.theme.colors.gray[900]};
`;

const RecommendationSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const RecommendationLine = styled.div`
  height: 2px;
  background-color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ApplyButton = styled.button`
  width: 100%;
  background-color: ${props => props.theme.colors.gray[900]};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: ${props => props.theme.spacing.xl};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ChatInputArea = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: 2px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.base};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SendButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: scale(1.05);
  }
`;

const AIAssistant = () => {
  const [messages] = useState([
    {
      type: 'user',
      text: '¿Cómo puedo mejorar la salud de mis cultivos?'
    },
    {
      type: 'assistant',
      text: 'Para reducir el riesgo de enfermedades, considera rotar tus cultivos.'
    },
    {
      type: 'user',
      text: '¿Qué indican estos datos de humedad?'
    },
    {
      type: 'assistant',
      text: 'El gráfico muestra una disminución de la humedad en la zona 3.'
    }
  ]);

  return (
    <AIContainer>
      <Header>
        <Title>Asistente de IA – CropGuardian</Title>
        <Subtitle>(Consejero Digital)</Subtitle>
        <Objective>
          <strong>Objetivo:</strong> Guiar al agricultor en recomendaciones.
        </Objective>
      </Header>

      <MainContent>
        <ChatSection>
          <BrowserBar>
            <BrowserDot />
            <BrowserDot />
            <BrowserDot />
          </BrowserBar>

          <ChatMessages>
            {messages.map((message, index) => (
              <Message key={index}>
                {message.type === 'assistant' && (
                  <RobotIcon>🤖</RobotIcon>
                )}
                <MessageBubble isUser={message.type === 'user'}>
                  {message.text}
                </MessageBubble>
              </Message>
            ))}
          </ChatMessages>

          <ChartPreview>
            <ChartSVG viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#4a4a4a', stopOpacity: 0.3 }} />
                </linearGradient>
              </defs>
              <path
                d="M 0 150 Q 50 100 100 120 T 200 100 T 300 80 T 400 60 T 500 40 L 500 200 L 0 200 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M 0 150 Q 50 100 100 120 T 200 100 T 300 80 T 400 60 T 500 40"
                fill="none"
                stroke="#000"
                strokeWidth="3"
              />
            </ChartSVG>
          </ChartPreview>

          <AlertsBox>
            <AlertItem>Riego necesario en Zona 2</AlertItem>
            <AlertItem>Posible riesgo de hongos</AlertItem>
          </AlertsBox>

          <ChatInputArea>
            <ChatInput 
              type="text" 
              placeholder="Escribe tu pregunta aquí..."
              disabled
            />
            <SendButton disabled>Enviar</SendButton>
          </ChatInputArea>
        </ChatSection>

        <RecommendationsPanel>
          <PanelTitle>Recomendaciones</PanelTitle>

          <RecommendationSection>
            <SectionTitle>Fertilización:</SectionTitle>
            <RecommendationLine />
            <RecommendationLine />
            <RecommendationLine />
          </RecommendationSection>

          <RecommendationSection>
            <SectionTitle>Riego:</SectionTitle>
            <RecommendationLine />
            <RecommendationLine />
            <RecommendationLine />
          </RecommendationSection>

          <RecommendationSection>
            <SectionTitle>Prevención de enfermedades:</SectionTitle>
            <RecommendationLine />
            <RecommendationLine />
            <RecommendationLine />
          </RecommendationSection>

          <ApplyButton>Aplicar recomendación</ApplyButton>
        </RecommendationsPanel>
      </MainContent>
    </AIContainer>
  );
};

export default AIAssistant;
