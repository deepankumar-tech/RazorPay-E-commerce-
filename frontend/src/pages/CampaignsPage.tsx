import React, { useState, useEffect } from 'react';
import { campaignService } from '../services/campaignService';
import { Layers, Sparkles, Check, X, Bot, Clock, AlertTriangle } from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for manual or AI generation
  const [title, setTitle] = useState('Boost Low-Performing Accessories');
  const [description, setDescription] = useState('Cross-sell 8% discount bundle on laptop stands and tech pouches to recent bag buyers.');
  const [discountPercent, setDiscountPercent] = useState(8);
  const [durationDays, setDurationDays] = useState(5);
  const [generating, setGenerating] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await campaignService.getCampaigns();
      setCampaigns(res.data?.campaigns || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await campaignService.generateProposal({
        title,
        description,
        targetAudience: 'Customers with recent purchases',
        discountPercent,
        durationDays,
      });
      fetchCampaigns();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate campaign proposal');
    } finally {
      setGenerating(false);
    }
  };

  const handleReview = async (campaignId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      await campaignService.reviewCampaign(campaignId, action, `Merchant explicitly ${action.toLowerCase()} this AI campaign proposal.`);
      fetchCampaigns();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>AI Campaign Orchestrator</h1>
          <p style={{ color: 'var(--text-secondary)' }}>AI proposes marketing campaigns; Merchant maintains full review & approval control</p>
        </div>
      </div>

      {/* Campaign Generator Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', color: '#c4b5fd', fontWeight: 700 }}>
          <Sparkles size={20} /> ASK AI TO GENERATE CAMPAIGN PROPOSAL
        </div>

        <form onSubmit={handleGenerateProposal} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Campaign Title / Objective</label>
            <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Discount % (&lt;=10%)</label>
            <input type="number" className="input-field" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} max={10} required />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Duration (Days)</label>
            <input type="number" className="input-field" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '0 1.2rem' }} disabled={generating}>
            {generating ? 'Generating...' : <><Bot size={18} /> Generate Proposal</>}
          </button>
        </form>
      </div>

      {/* Campaigns Listing with Review Approval Flow */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.2rem' }}>Merchant Campaign Review Queue</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>No campaigns generated yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {campaigns.map((c) => (
            <div key={c.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{c.title}</h3>
                  {c.aiGenerated && <span className="badge badge-violet">AI PROPOSAL</span>}
                  <span className={`badge ${c.status === 'APPROVED' || c.status === 'ACTIVE' ? 'badge-green' : c.status === 'REJECTED' ? 'badge-red' : 'badge-violet'}`}>
                    {c.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>{c.description}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Target: <strong>{c.targetAudience}</strong> • Discount: <strong>{c.discountPercent}%</strong> • Duration: <strong>{c.durationDays} Days</strong>
                </div>
              </div>

              {/* Review Buttons if status is PROPOSED */}
              {c.status === 'PROPOSED' ? (
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button onClick={() => handleReview(c.id, 'APPROVED')} className="btn btn-success" style={{ padding: '0.6rem 1.2rem' }}>
                    <Check size={18} /> Approve & Activate
                  </button>
                  <button onClick={() => handleReview(c.id, 'REJECTED')} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', color: 'var(--danger)' }}>
                    <X size={18} /> Reject Proposal
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: c.status === 'APPROVED' || c.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                  Campaign {c.status} by Merchant
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
