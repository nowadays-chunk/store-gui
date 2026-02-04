import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { styled } from '@mui/system';

const Container = styled('div')({
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
});

const List = styled('ul')({
    listStyle: 'none',
    padding: 0,
    marginTop: '1rem'
});

const ListItem = styled('li')({
    padding: '1rem',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ':last-child': {
        borderBottom: 'none'
    }
});

const Button = styled('button')({
    padding: '0.5rem 1rem',
    background: '#0f172a',
    color: '#fff',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer'
});

const Input = styled('input')({
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    width: '100%',
    marginBottom: '1rem'
});

const Textarea = styled('textarea')({
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    width: '100%',
    minHeight: '100px',
    marginBottom: '1rem'
});

export default function AdminCMS() {
    const [pages, setPages] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPage, setNewPage] = useState({ title: '', slug: '', content: '' });

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            const data = await api.get('/cms/pages');
            setPages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cms/pages', newPage);
            setIsCreating(false);
            setNewPage({ title: '', slug: '', content: '' });
            loadPages();
        } catch (err) {
            alert('Failed to create page');
        }
    };

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Gestion de Contenu (CMS)</h1>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? 'Annuler' : '+ Nouvelle Page'}
                </Button>
            </div>

            {isCreating && (
                <Container style={{ marginBottom: '2rem' }}>
                    <h2>Créer une page</h2>
                    <form onSubmit={handleCreate}>
                        <Input
                            placeholder="Titre"
                            value={newPage.title}
                            onChange={e => setNewPage({ ...newPage, title: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Slug (ex: a-propos)"
                            value={newPage.slug}
                            onChange={e => setNewPage({ ...newPage, slug: e.target.value })}
                            required
                        />
                        <Textarea
                            placeholder="Contenu (HTML ou Texte)"
                            value={newPage.content}
                            onChange={e => setNewPage({ ...newPage, content: e.target.value })}
                            required
                        />
                        <Button type="submit">Publier</Button>
                    </form>
                </Container>
            )}

            <Container>
                <h2>Pages Publiées</h2>
                {pages.length === 0 && <p>Aucune page trouvée.</p>}
                <List>
                    {pages.map(p => (
                        <ListItem key={p.id}>
                            <div>
                                <strong>{p.title}</strong>
                                <span style={{ color: '#64748b', marginLeft: '1rem' }}>/{p.slug}</span>
                            </div>
                            <Button style={{ background: '#3b82f6' }}>Editer</Button>
                        </ListItem>
                    ))}
                </List>
            </Container>
        </AdminLayout>
    );
}
