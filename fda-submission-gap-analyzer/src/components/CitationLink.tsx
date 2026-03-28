import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCitation } from '@/contexts/CitationContext';
import { useLanguage } from '@/lib/i18n';

type Props = {
  citationKey: string;
  className?: string;
};

/** Inline traceability control for built-in regulation / guidance PDFs. */
export function CitationLink({ citationKey, className }: Props) {
  const { openBuiltinCitation } = useCitation();
  const { t } = useLanguage();
  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      className={`h-auto p-0 text-xs text-blue-600 inline-flex items-center gap-1 ${className ?? ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openBuiltinCitation(citationKey);
      }}
    >
      <BookOpen className="w-3.5 h-3.5 shrink-0" />
      {t('溯源', 'Source')}
    </Button>
  );
}

type UserProps = { entryId: string; className?: string };

export function CitationUserLink({ entryId, className }: UserProps) {
  const { openUserPdfCitation } = useCitation();
  const { t } = useLanguage();
  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      className={`h-auto p-0 text-xs text-teal-700 inline-flex items-center gap-1 ${className ?? ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openUserPdfCitation(entryId);
      }}
    >
      <BookOpen className="w-3.5 h-3.5 shrink-0" />
      {t('知识库 PDF', 'KB PDF')}
    </Button>
  );
}
