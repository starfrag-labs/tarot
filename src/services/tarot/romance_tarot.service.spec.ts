import { Test, TestingModule } from '@nestjs/testing';
import { RomanceTarotService } from './romance_tarot.service';
import { OpenAIService } from '../openai.service';
import { PrismaService } from '../prisma.service';
import { TarotType } from '@prisma/client';
import { MajorArcanaEnum } from 'src/schemas/arcana/major_arcana.schema';
import { DirectionEnum } from 'src/schemas/arcana/direction.schema';

describe('RomanceTarotService', () => {
  let service: RomanceTarotService;
  let openAIService: OpenAIService;
  let prismaService: PrismaService;

  const mockOpenAIService = {
    getRomanceTarotMessage: jest.fn(),
  };

  const mockPrismaService = {
    latestTarot: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RomanceTarotService,
        {
          provide: OpenAIService,
          useValue: mockOpenAIService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RomanceTarotService>(RomanceTarotService);
    openAIService = module.get<OpenAIService>(OpenAIService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('readTarot', () => {
    it('should return romance tarot message from OpenAI', async () => {
      const mockRequest = {
        card: {
          card: MajorArcanaEnum.THE_LOVERS,
          image: 'https://example.com/lovers.png',
          direction: DirectionEnum.UPRIGHT,
        },
        userInfo: {
          gender: 'female' as const,
          brithDateTime: '1990-05-15T00:00:00Z',
          datingStatus: 'single' as const,
          jobStatus: 'employed' as const,
        },
      };

      const mockResponse = {
        description: 'Love is in the air!',
      };

      mockOpenAIService.getRomanceTarotMessage.mockResolvedValue(mockResponse);

      const result = await service.readTarot(mockRequest);

      expect(openAIService.getRomanceTarotMessage).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('saveData', () => {
    it('should save romance tarot data to database', async () => {
      const mockData = {
        result: { description: 'Test description' },
        userUuid: 'test-uuid',
      };

      const mockSavedData = {
        id: 1,
        userUuid: 'test-uuid',
        type: TarotType.ROMMANCE,
        version: 1.0,
        data: mockData.result,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.latestTarot.upsert.mockResolvedValue(mockSavedData);

      const result = await service.saveData(mockData);

      expect(prismaService.latestTarot.upsert).toHaveBeenCalledWith({
        where: {
          userUuid_type: {
            userUuid: mockData.userUuid,
            type: TarotType.ROMMANCE,
          },
        },
        create: {
          userUuid: mockData.userUuid,
          type: TarotType.ROMMANCE,
          version: RomanceTarotService.version,
          data: mockData.result,
        },
        update: {
          data: mockData.result,
        },
      });
      expect(result).toEqual(mockSavedData);
    });
  });
});
