import { collectionTabs } from '@utils/collectionTabs';
import {
  TwitterLogo,
  MediumLogo,
  FacebookLogo,
  GithubLogo,
  DiscordLogo,
  YoutubeLogo,
  TelegramLogo,
} from 'phosphor-react';
import { CollectionProps } from '@services/collection/getCollectionService';

interface CollectionStatsProps {
  stats: {
    assets: number;
    burned: number;
    burned_by_template: {
      burned: number;
      template_id: number;
    }[];
    burned_by_schema: {
      burned: number;
      schema_name: string;
    }[];
    templates: number;
    schemas: number;
  };
  collection: CollectionProps;
}

export function CollectionStats({ stats, collection }: CollectionStatsProps) {
  const statsContent = [
    ['Name', collection.collection_name],
    ['Created', new Date(Number(collection.created_at_time)).toLocaleString()],
    ['Assets', stats.assets ?? 0],
    ['Burned', stats.burned ?? 0],
    ['Templates', stats.templates],
    ['Schemas', stats.schemas],
  ];

  const creatorInfo =
    collection.data.creator_info && JSON.parse(collection.data.creator_info);
  const socials =
    collection.data.socials && JSON.parse(collection.data.socials);

  const hasCreatorInfo =
    creatorInfo &&
    Object.keys(creatorInfo).filter((key) => creatorInfo[key] !== '').length >
      0;
  const hasSocials =
    socials &&
    Object.keys(socials).filter((key) => socials[key] !== '').length > 0;

  function handleSocialIcon(social) {
    switch (social) {
      case 'twitter':
        return <TwitterLogo size={24} />;
        break;
      case 'facebook':
        return <FacebookLogo size={24} />;
        break;
      case 'medium':
        return <MediumLogo size={24} />;
        break;
      case 'github':
        return <GithubLogo size={24} />;
        break;
      case 'discord':
        return <DiscordLogo size={24} />;
        break;
      case 'youtube':
        return <YoutubeLogo size={24} />;
        break;
      case 'telegram':
        return <TelegramLogo size={24} />;
        break;

      default:
        break;
    }
  }

  return (
    <section className="container">
      <div className="flex flex-col py-8 gap-12">
        <h2 className="headline-2">{collectionTabs[0].name}</h2>
        <div className="flex flex-col md:flex-row gap-24">
          <div className="flex-1">
            <h3 className="headline-3 mb-4">Description</h3>
            <p className="body-1">{collection.data.description}</p>
          </div>
          <div className="flex-1">
            <h3 className="headline-3 mb-4">Stats</h3>
            {statsContent.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-3 body-2 text-white border-b border-neutral-700"
              >
                <span>{label}</span>
                <span className="font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-24">
          {hasCreatorInfo && (
            <div className="flex-1">
              <h3 className="headline-3 mb-4">Company details</h3>
              {Object.keys(creatorInfo).map((key) => {
                if (creatorInfo[key]) {
                  return (
                    <div
                      key={key}
                      className="flex justify-between py-3 body-2 text-white border-b border-neutral-700"
                    >
                      <span>{key}</span>
                      <span className="font-bold">{creatorInfo[key]}</span>
                    </div>
                  );
                }
              })}
            </div>
          )}
          {hasSocials && (
            <div className="flex-1">
              <h3 className="headline-3 mb-4">Social medias</h3>
              {Object.keys(socials).map((key) => {
                if (socials[key]) {
                  return (
                    <a
                      key={key}
                      href={socials[key]}
                      target="_blank"
                      className="font-bold underline"
                      rel="noreferrer"
                    >
                      <div className="flex justify-start gap-4 py-3 body-2 text-white border-b border-neutral-700">
                        {handleSocialIcon(key)}
                        <span className="font-bold">{socials[key]}</span>
                      </div>
                    </a>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
