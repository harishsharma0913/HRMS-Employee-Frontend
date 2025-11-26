import HelpHeader from '../HelpCenter/HelpHeader';
import HelpSections from '../HelpCenter/HelpSections';
import HelpFooter from '../HelpCenter/HelpFooter';
import SupportTicketForm from '../HelpCenter/SupportTicketForm';
import RecentTicketsTable from '../HelpCenter/RecentTicketsTable';

export default function HelpPage() {
  return (
    <>
      <HelpHeader />
      <SupportTicketForm />
      <RecentTicketsTable />
      <HelpSections />
      <HelpFooter />
    </>
  );
}

