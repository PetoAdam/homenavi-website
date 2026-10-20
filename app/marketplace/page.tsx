import { PageHeader } from "../components/ui";
import { loadMarketplace } from "../../lib/marketplace";
import MarketplaceClient from "./MarketplaceClient";

export default async function MarketplacePage() {
  const { integrations, source } = await loadMarketplace();

  return (
    <>
      <section className="section">
        <PageHeader
          title="Marketplace"
          subtitle="Verified community integrations for devices, dashboards, and automations."
        />
        <MarketplaceClient integrations={integrations} source={source} />
      </section>
    </>
  );
}
