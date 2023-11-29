using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<Result<List<CommentsDto>>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentsDto>>>
        {
            private readonly DataContext _context;
            public readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<CommentsDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _context.Comments
                .Where(x => x.Activity.Id == request.ActivityId)
                .OrderBy(x => x.CreatedAt)
                .ProjectTo<CommentsDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

                return Result<List<CommentsDto>>.Success(comments);
            }
        }
    }
}