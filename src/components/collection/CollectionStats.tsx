import { collectionTabs } from '@utils/collectionTabs';
import {
  TwitterLogo,
  MediumLogo,
  FacebookLogo,
  GithubLogo,
  DiscordLogo,
  YoutubeLogo,
  TelegramLogo,
} from '@phosphor-icons/react';
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
  chainKey: string;
}

export function CollectionStats({ stats, collection, chainKey }: CollectionStatsProps) {
  const statsContent = [
    // ['ID', collection.collection_name],
    ['Created', new Date(Number(collection.created_at_time)).toLocaleString()],
    ['NFTs', stats.assets ?? 0],
    ['Burned', stats.burned ?? 0],
    ['Templates', stats.templates],
  ];

  if(chainKey != "xpr") {
    statsContent.push(['Schemas', stats.schemas])
  }

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
        /* TODO change to X, see https://github.com/phosphor-icons/homepage/issues/323 */
        return <TwitterLogo size={24} />;
      case 'facebook':
        return <FacebookLogo size={24} />;
      case 'medium':
        return <MediumLogo size={24} />;
      case 'github':
        return <GithubLogo size={24} />;
      case 'discord':
        return <DiscordLogo size={24} />;
      case 'youtube':
        return <YoutubeLogo size={24} />;
      case 'telegram':
        return <TelegramLogo size={24} />;
      default:
        break;
    }
  }

  return (
    <section className="container">
      <div className="flex flex-col py-8 gap-12">
        <h2 className="headline-2">{collectionTabs[0].name}</h2>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-12">
          <div className="flex-1">
            <h3 className="headline-3 mb-4">Description</h3>
            <p className="body-1">{collection.data.description}</p>
          </div>
          <div className="flex-1">
            <h3 className="headline-3 mb-4">Numbers</h3>
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
          <div className="flex-1">
            <h3 className="headline-3 mb-4">Authorized accounts</h3>
            <div className="flex flex-row gap-2 flex-wrap">
              {collection.authorized_accounts.map((item, index) => (
                <span key={item} className="body-1">
                  {item}
                  {index !== collection.authorized_accounts.length - 1
                    ? ','
                    : '.'}
                </span>
              ))}
            </div>
          </div>
          {collection.notify_accounts.length > 0 && (
            <div className="flex-1">
              <h3 className="headline-3 mb-4">Notified accounts</h3>
              <div className="flex flex-row gap-2 flex-wrap">
                {collection.notify_accounts.map((item, index) => (
                  <span key={item} className="body-1">
                    {item}
                    {index !== collection.notify_accounts.length - 1
                      ? ','
                      : '.'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
