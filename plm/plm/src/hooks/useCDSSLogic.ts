import { useState, useEffect, useCallback } from 'react';
import { PatientContext, CDSSResponse } from '../types';
import { MOCK_INITIAL_RESPONSE, SCENARIOS } from '../mockData';

export function useCDSSLogic() {
  const [patientContext, setPatientContext] = useState<PatientContext>({
    unstructuredText: '',
    structuredData: {},
    confirmedConcepts: []
  });

  const [response, setResponse] = useState<CDSSResponse>(MOCK_INITIAL_RESPONSE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);

  // Simulate PII Check
  const checkPII = (text: string): { hasPII: boolean; maskedText: string } => {
    // Simple regex for phone numbers (11 digits starting with 1) and ID cards (18 digits)
    const phoneRegex = /1[3-9]\d{9}/g;
    const idCardRegex = /\d{17}[\dXx]/g;
    
    let hasPII = false;
    let maskedText = text;

    if (phoneRegex.test(text)) {
      hasPII = true;
      maskedText = maskedText.replace(phoneRegex, '138******');
    }
    if (idCardRegex.test(text)) {
      hasPII = true;
      maskedText = maskedText.replace(idCardRegex, '440106************');
    }

    return { hasPII, maskedText };
  };

  const loadScenario = (scenarioId: keyof typeof SCENARIOS) => {
    const scenario = SCENARIOS[scenarioId];
    if (!scenario) return;

    setPatientContext(prev => ({
      ...prev,
      unstructuredText: scenario.text,
      confirmedConcepts: []
    }));
    setCurrentScenarioId(scenarioId);
    
    // Auto-analyze for better UX
    setIsAnalyzing(true);
    setTimeout(() => {
      setResponse(scenario.response);
      setIsAnalyzing(false);
    }, 800);
  };

  const analyze = useCallback(async () => {
    setIsAnalyzing(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // If we have a selected scenario, use its response
    if (currentScenarioId && SCENARIOS[currentScenarioId as keyof typeof SCENARIOS]) {
      setResponse(SCENARIOS[currentScenarioId as keyof typeof SCENARIOS].response);
    } else if (patientContext.unstructuredText.length > 10) {
      // Fallback to Case 1 if just typing random text
      setResponse(SCENARIOS.case1.response);
    } else {
      setResponse(MOCK_INITIAL_RESPONSE);
    }
    setIsAnalyzing(false);
  }, [patientContext.unstructuredText, currentScenarioId]);

  const confirmConcept = (conceptId: string) => {
    setResponse(prev => ({
      ...prev,
      concepts: prev.concepts.map(c => 
        c.id === conceptId ? { ...c, confirmed: true } : c
      )
    }));
    setPatientContext(prev => ({
      ...prev,
      confirmedConcepts: [...prev.confirmedConcepts, conceptId]
    }));
  };

  const updateStructuredData = (key: string, value: any) => {
    setPatientContext(prev => ({
      ...prev,
      structuredData: { ...prev.structuredData, [key]: value }
    }));
  };

  const updateConcept = (conceptId: string, newText: string) => {
    setResponse(prev => ({
      ...prev,
      concepts: prev.concepts.map(c => 
        c.id === conceptId ? { ...c, text: newText, confirmed: true } : c
      )
    }));
  };

  const updateMissingInput = (inputId: string, value: string) => {
    // Update the missing input value in the response (if we were tracking it there)
    // For now, let's assume filling a missing input might trigger a re-evaluation or just store it
    // We'll update the structured data as a side effect if it matches a known key
    // And remove it from missing inputs if it's filled
    
    setResponse(prev => ({
      ...prev,
      missingInputs: prev.missingInputs.map(input => 
        input.id === inputId ? { ...input, value } : input
      )
    }));

    // Also update structured data context
    updateStructuredData(inputId, value);
  };

  return {
    patientContext,
    setPatientContext,
    response,
    isAnalyzing,
    analyze,
    checkPII,
    confirmConcept,
    updateConcept,
    updateMissingInput,
    updateStructuredData,
    loadScenario,
    currentScenarioId
  };
}
