import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ORGANIZATIONS } from '../graphql/queries';
import { Organization } from '../types';

interface OrganizationContextType {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  setSelectedOrganization: (org: Organization) => void;
  loading: boolean;
  error: any;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
};

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const { data, loading, error } = useQuery(GET_ORGANIZATIONS);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    if (data?.organizations && data.organizations.length > 0 && !selectedOrganization) {
      setSelectedOrganization(data.organizations[0]);
    }
  }, [data, selectedOrganization]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations: data?.organizations || [],
        selectedOrganization,
        setSelectedOrganization,
        loading,
        error,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};