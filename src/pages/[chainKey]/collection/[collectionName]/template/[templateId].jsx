import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { ImageSquare } from 'phosphor-react';
import Link from 'next/link';
import { withUAL } from 'ual-reactjs-renderer';

import { ipfsEndpoint } from '@configs/globalsConfig';

import { Card } from '@components/Card';

import { isAuthorizedAccount } from '@utils/isAuthorizedAccount';

import { getTemplateService } from '@services/template/getTemplateService';

function Template({ ual, chainKey, template }) {
  const image = template.immutable_data.img;
  const video = template.immutable_data.video;
  const collection = template.collection;

  const hasAuthorization = isAuthorizedAccount(ual, collection);

  return (
    <>
      <header className="-mt-14 overflow-hidden -z-10">
        <div className="container flex items-center">
          <div className="flex-1">
            <p className="headline-3 mb-2">Template #{template.template_id}</p>
            <h1 className="headline-1">{template.name}</h1>
            <div className="flex gap-4 mt-8">
              {hasAuthorization && (
                <Link
                  href={`/${chainKey}/collection/${collection.collection_name}/template/${template.template_id}/edit`}
                >
                  <a className="btn">Edit Template</a>
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-center py-32">
            <div className="relative max-w-sm w-full aspect-square drop-shadow-lg">
              <>
                {image && (
                  <>
                    <Image
                      alt={template.name}
                      src={`${ipfsEndpoint}/${image}`}
                      layout="fill"
                      objectFit="contain"
                    />
                    <div className="absolute blur-3xl -z-10 w-[150%] h-[150%] -left-[25%] -top-[25%]">
                      <Image
                        alt={template.name}
                        src={`${ipfsEndpoint}/${image}`}
                        layout="fill"
                        objectFit="fill"
                        quality={1}
                      />
                    </div>
                  </>
                )}
                {video && (
                  <>
                    <video
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source
                        src={`${ipfsEndpoint}/${video}`}
                        type="video/mp4"
                      />
                    </video>
                    <div className="absolute blur-3xl -z-10 w-[150%] h-[150%] -left-[25%] -top-[25%]">
                      <video
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        <source
                          src={`${ipfsEndpoint}/${video}`}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  </>
                )}
                {!video && !image && (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <ImageSquare size={64} />
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </header>
      <Tab.Group>
        <Tab.List className="tab-list -mt-14 mb-14">
          <Tab className="tab">Information</Tab>
          <Tab className="tab">Immutable data</Tab>
        </Tab.List>
        <Tab.Panels className="container">
          <Tab.Panel>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-0 justify-center">
              <div className="grid grid-cols-1">
                <Card
                  href={`/${chainKey}/collection/${collection.collection_name}`}
                  image={
                    collection.img ? `${ipfsEndpoint}/${collection.img}` : ''
                  }
                  title={collection.name}
                  subtitle={`by ${collection.author}`}
                />
              </div>
              <div className="md:w-1/2 w-full">
                <div className="w-full md:max-w-sm mx-auto">
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                    <span>Burnable</span>
                    <span className="font-bold">
                      {template.is_burnable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                    <span>Transferable</span>
                    <span className="font-bold">
                      {template.is_transferable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                    <span>Issued Supply</span>
                    <span className="font-bold">{template.issued_supply}</span>
                  </div>
                  <div className="flex justify-between py-3 body-2 text-white border-b border-neutral-700">
                    <span>Max Supply</span>
                    <span className="font-bold">
                      {parseInt(template.max_supply, 10) || 'Infinite'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="w-full px-4 mx-auto">
              {Object.entries(template.immutable_data).map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-3 body-2 gap-8 text-white border-b border-neutral-700"
                >
                  <span>{label}</span>
                  <span className="font-bold break-all">{value}</span>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { chainKey, collectionName, templateId } = params;

  const { data: template } = await getTemplateService(chainKey, {
    collectionName,
    templateId,
  });

  return {
    props: {
      template: template.data,
      chainKey,
    },
  };
}

export default withUAL(Template);
